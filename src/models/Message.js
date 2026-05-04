import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: [true, 'Trip ID is required'],
    },
    senderName: {
      type: String,
      required: [true, 'Sender name is required'],
    },
    senderEmail: {
      type: String,
      required: [true, 'Sender email is required'],
    },
    avatar: {
      type: String,
      default: '🧑‍✈️',
    },
    text: {
      type: String,
      required: [true, 'Message text is required'],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
