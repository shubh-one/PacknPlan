import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userImage: {
    type: String,
    default: '',
  },
  // What is being reviewed
  category: {
    type: String,
    enum: ['destination', 'hotel', 'restaurant', 'experience'],
    required: true,
  },
  // Name of the place/hotel/restaurant/experience
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 120,
  },
  // Which city/destination
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
  },
  // Overall rating 1-5
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  // Sub-ratings (optional, mainly for hotels)
  subRatings: {
    cleanliness: { type: Number, min: 1, max: 5 },
    location: { type: Number, min: 1, max: 5 },
    value: { type: Number, min: 1, max: 5 },
    service: { type: Number, min: 1, max: 5 },
  },
  // Review text
  text: {
    type: String,
    required: [true, 'Review text is required'],
    maxlength: 2000,
  },
  // When the user visited
  visitDate: {
    type: String,
    default: '',
  },
  // Linked trip (optional)
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
  },
  // Helpfulness votes
  helpful: {
    type: Number,
    default: 0,
  },
  helpfulBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  // Verified = user has a trip to this city
  verified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for querying
ReviewSchema.index({ city: 1, category: 1 });
ReviewSchema.index({ userId: 1 });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
