import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    enum: ['transport', 'hotel', 'food', 'activities', 'shopping', 'misc'],
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Expense name is required'],
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  date: {
    type: String,
    default: 'Today',
  },
}, {
  timestamps: true,
});

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
