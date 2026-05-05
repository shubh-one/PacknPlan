'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Send, Search, MoreVertical,
  Users, MapPin, Plus, MessageCircle, Loader2
} from 'lucide-react';
import Link from 'next/link';
import styles from './chat.module.css';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const POLL_INTERVAL = 3000; // 3 seconds

export default function ChatPage() {
  const { session, status } = useRequireAuth();
  const [chatRooms, setChatRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  // Fetch trips as chat rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch('/api/trips');
        if (res.ok) {
          const trips = await res.json();
          setChatRooms(trips);
          if (trips.length > 0) setActiveRoom(trips[0]._id);
        }
      } catch (err) {
        console.error('Failed to load chat rooms:', err);
      } finally {
        setLoading(false);
      }
    };
    if (status === 'authenticated') fetchRooms();
  }, [status]);

  // Fetch messages for active room
  const fetchMessages = useCallback(async (silent = false) => {
    if (!activeRoom) return;
    try {
      const res = await fetch(`/api/messages?tripId=${activeRoom}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        // Auto-scroll only on new messages
        if (data.length > lastMessageCount) {
          setLastMessageCount(data.length);
          setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        }
      }
    } catch (err) {
      if (!silent) console.error('Failed to load messages:', err);
    }
  }, [activeRoom, lastMessageCount]);

  // Load messages on room change
  useEffect(() => {
    if (!activeRoom) return;
    setMessages([]);
    setLastMessageCount(0);
    fetchMessages();
  }, [activeRoom]);

  // Poll for new messages
  useEffect(() => {
    if (!activeRoom) return;
    pollRef.current = setInterval(() => fetchMessages(true), POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [activeRoom, fetchMessages]);

  // Scroll on first load
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = async () => {
    if (!input.trim() || !activeRoom || sending) return;
    const text = input.trim();
    setInput('');
    setSending(true);

    // Optimistic update
    const tempMsg = {
      _id: `temp-${Date.now()}`,
      tripId: activeRoom,
      senderName: session?.user?.name || 'Traveler',
      senderEmail: session?.user?.email || '',
      avatar: '🧑‍✈️',
      text,
      createdAt: new Date().toISOString(),
      _temp: true,
    };
    setMessages((prev) => [...prev, tempMsg]);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId: activeRoom, text }),
      });
      if (res.ok) {
        // Replace temp message with real one
        await fetchMessages();
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const activeChat = chatRooms.find((r) => r._id === activeRoom);

  // Get last message for each room
  const getLastMessagePreview = (roomId) => {
    if (roomId === activeRoom && messages.length > 0) {
      const last = messages[messages.length - 1];
      return last.text.length > 30 ? last.text.substring(0, 30) + '...' : last.text;
    }
    return 'Tap to start chatting';
  };

  // Group messages by date
  const getDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (status === 'loading') return null;
  if (status === 'unauthenticated') return null;

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
            <Link href="/dashboard/planner" className={styles.newChatBtn}>
              <Plus size={16} />
            </Link>
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
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                <Loader2 size={20} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 0.5rem' }} />
                <p style={{ fontSize: 'var(--text-sm)' }}>Loading rooms...</p>
              </div>
            ) : chatRooms.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                <MessageCircle size={32} style={{ color: 'var(--text-tertiary)', margin: '0 auto 0.75rem' }} />
                <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: '0.5rem' }}>No trips yet</p>
                <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)', marginBottom: '1rem' }}>Create a trip to start chatting with co-travelers!</p>
                <Link href="/dashboard/planner" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 1rem', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 600, textDecoration: 'none' }}>
                  <Plus size={14} /> Create Trip
                </Link>
              </div>
            ) : (
              chatRooms
                .filter((r) => r.destination?.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((room) => (
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
                      <div className={styles.roomLastMsg}>{getLastMessagePreview(room._id)}</div>
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
                  <Users size={12} /> {activeChat?.travelers || 1} members • Trip Chat
                </span>
              </div>
            </div>
            <div className={styles.chatActions}>
              <button className={styles.actionBtn}><MoreVertical size={18} /></button>
            </div>
          </div>

          {/* Messages */}
          <div className={styles.messagesArea}>
            {!activeRoom ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-tertiary)' }}>
                <MessageCircle size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p style={{ fontWeight: 600 }}>Select a trip to start chatting</p>
              </div>
            ) : messages.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-tertiary)' }}>
                <MessageCircle size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>No messages yet</p>
                <p style={{ fontSize: 'var(--text-xs)' }}>Start the conversation about your {activeChat?.destination} trip!</p>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => {
                  const isMine = msg.senderEmail === session?.user?.email;
                  const formattedTime = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  // Show date divider
                  const showDate = i === 0 || getDateLabel(msg.createdAt) !== getDateLabel(messages[i - 1].createdAt);

                  return (
                    <div key={msg._id}>
                      {showDate && (
                        <div className={styles.dateDivider}>
                          <span>{getDateLabel(msg.createdAt)}</span>
                        </div>
                      )}
                      <motion.div
                        className={`${styles.message} ${isMine ? styles.mine : styles.theirs}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0 }}
                        style={{ opacity: msg._temp ? 0.6 : 1 }}
                      >
                        {!isMine && (
                          <div className={styles.msgAvatar}>{msg.avatar}</div>
                        )}
                        <div className={styles.msgContent}>
                          {!isMine && <span className={styles.msgSender}>{msg.senderName}</span>}
                          <div className={styles.msgBubble}>
                            <p>{msg.text}</p>
                            <span className={styles.msgTime}>
                              {formattedTime}
                              {msg._temp && ' ⏳'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          {activeRoom && (
            <div className={styles.inputArea}>
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className={styles.msgInput}
                id="chat-input"
                disabled={!activeRoom}
              />
              <button
                className={styles.sendBtn}
                onClick={handleSend}
                disabled={!input.trim() || sending}
                id="send-message-btn"
              >
                {sending ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={18} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
