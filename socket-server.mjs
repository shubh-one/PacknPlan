import { createServer } from 'node:http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import Message from './src/models/Message.js';

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = 3001;

// Connect to MongoDB
if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in environment variables');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('Socket Server connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Create HTTP server
const httpServer = createServer((req, res) => {
  // Simple health check endpoint
  if (req.url === '/health') {
    res.writeHead(200);
    res.end('Socket Server is running');
  }
});

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a specific trip chat room
  socket.on('join_room', (tripId) => {
    socket.join(tripId);
    console.log(`User ${socket.id} joined room: ${tripId}`);
  });

  // Handle incoming messages
  socket.on('send_message', async (data) => {
    try {
      // Create new message in DB
      const newMessage = await Message.create({
        tripId: data.tripId,
        senderName: data.senderName,
        senderEmail: data.senderEmail,
        avatar: data.avatar,
        text: data.text,
      });

      // Broadcast the saved message to everyone in the room (including sender)
      // We send it to everyone so the UI updates consistently with DB IDs
      io.to(data.tripId).emit('receive_message', newMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`\n🚀 WebSockets Server running on port ${PORT}\n`);
});
