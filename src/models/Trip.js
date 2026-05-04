import mongoose from 'mongoose';

const TripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true,
  },
  emoji: {
    type: String,
    default: '✈️',
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
    min: 0,
  },
  travelers: {
    type: Number,
    default: 1,
    min: 1,
  },
  status: {
    type: String,
    enum: ['Planning', 'Booked', 'In Progress', 'Completed'],
    default: 'Planning',
  },
}, {
  timestamps: true,
});

export default mongoose.models.Trip || mongoose.model('Trip', TripSchema);
