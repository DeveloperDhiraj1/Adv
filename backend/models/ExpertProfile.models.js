import mongoose from 'mongoose';

const expertProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  headline: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  expertise: [{
    type: String
  }], 
  qualification: {
    type: String,
    required: true
  },
  experienceYears: {
    type: Number,
    required: true
  },
  languages: [{
    type: String
  }],
  verificationStatus: {
    type: String,
    enum: ['PENDING', 'VERIFIED', 'REJECTED'],
    default: 'PENDING'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const ExpertProfile = mongoose.model('ExpertProfile', expertProfileSchema);
export default ExpertProfile;