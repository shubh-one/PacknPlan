'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Send, Search, Phone, Video, MoreVertical,
  Image, Smile, Paperclip, Users, MapPin, Circle, Plus
} from 'lucide-react';
import Link from 'next/link';
import styles from './chat.module.css';

import { io } from 'socket.io-client';
import { useSession } from 'next-auth/react';

let socket;

export default function ChatPage() {
  const { data: session } = useSession();
  const [chatRooms, setChatRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // 1. Fetch trips to use as chat rooms
    const fetchRooms = async () => {
      const res = await fetch('/api/trips');
      if (res.ok) {
        const trips = await res.json();
        setChatRooms(trips);
        if (trips.length > 0) setActiveRoom(trips[0]._id);
      }
      setLoading(false);
    };
    fetchRooms();

    // 2. Initialize Socket Connection
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    socket = io(SOCKET_URL);

    socket.on('receive_message', (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // 3. Fetch messages when activeRoom changes
    if (!activeRoom) return;
    
    socket.emit('join_room', activeRoom);
    
    const fetchMessages = async () => {
      const res = await fetch(`/api/messages?tripId=${activeRoom}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    };
    fetchMessages();
  }, [activeRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !activeRoom) return;
    
    const msgData = {
      tripId: activeRoom,
      senderName: session?.user?.name || 'Traveler',
      senderEmail: session?.user?.email || '',
      avatar: session?.user?.avatar || '🧑‍✈️',
      text: input,
    };
    
    socket.emit('send_message', msgData);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const activeChat = chatRooms.find((r) => r._id === activeRoom);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/dashboard" className={styles.backBtn}>
          <ArrowLeft size={18} /> <span>Dashboard</span>
        </Link>
      </div>

      <div className={styles.chatLayout}>
        {/* Sidebar - Room List */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>Chats</h2>
            <button className={styles.newChatBtn}><Plus size={16} /></button>
          </div>

          <div className={styles.searchWrap}>
            <Search size={15} />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.roomList}>
            {loading ? (
              <p style={{ padding: '1rem', color: 'var(--text-tertiary)', textAlign: 'center' }}>Loading rooms...</p>
            ) : chatRooms.length === 0 ? (
              <p style={{ padding: '1rem', color: 'var(--text-tertiary)', textAlign: 'center' }}>No trips yet. Create a trip to chat!</p>
            ) : (
              chatRooms.filter((r) => r.destination.toLowerCase().includes(searchQuery.toLowerCase())).map((room) => (
                <button
                  key={room._id}
                  className={`${styles.roomItem} ${activeRoom === room._id ? styles.roomActive : ''}`}
                  onClick={() => setActiveRoom(room._id)}
                >
                  <div className={styles.roomAvatar}>{room.emoji || '✈️'}</div>
                  <div className={styles.roomInfo}>
                    <div className={styles.roomNameRow}>
                      <span className={styles.roomName}>{room.destination}</span>
                    </div>
                    <div className={styles.roomLastMsg}>Group Chat</div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className={styles.chatMain}>
          {/* Chat Header */}
          <div className={styles.chatHeader}>
            <div className={styles.chatInfo}>
              <span className={styles.chatEmoji}>{activeChat?.emoji || '✈️'}</span>
              <div>
                <h3 className={styles.chatName}>{activeChat?.destination || 'Select a trip'}</h3>
                <span className={styles.chatMeta}>
                  <Users size={12} /> {activeChat?.travelers || 1} members
                </span>
              </div>
            </div>
            <div className={styles.chatActions}>
              <button className={styles.actionBtn}><Phone size={18} /></button>
              <button className={styles.actionBtn}><Video size={18} /></button>
              <button className={styles.actionBtn}><MoreVertical size={18} /></button>
            </div>
          </div>

          {/* Messages */}
          <div className={styles.messagesArea}>
            <div className={styles.dateDivider}>
              <span>Today</span>
            </div>

            {messages.map((msg, i) => {
              const isMine = msg.senderEmail === session?.user?.email;
              const formattedTime = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              
              return (
                <motion.div
                  key={msg._id}
                  className={`${styles.message} ${isMine ? styles.mine : styles.theirs}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0 }}
                >
                  {!isMine && (
                    <div className={styles.msgAvatar}>{msg.avatar}</div>
                  )}
                  <div className={styles.msgContent}>
                    {!isMine && <span className={styles.msgSender}>{msg.senderName}</span>}
                    <div className={styles.msgBubble}>
                      <p>{msg.text}</p>
                      <span className={styles.msgTime}>{formattedTime}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={styles.inputArea}>
            <button className={styles.attachBtn}><Paperclip size={18} /></button>
            <button className={styles.attachBtn}><Image size={18} /></button>
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className={styles.msgInput}
              id="chat-input"
            />
            <button className={styles.emojiBtn}><Smile size={18} /></button>
            <button
              className={styles.sendBtn}
              onClick={handleSend}
              disabled={!input.trim()}
              id="send-message-btn"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
