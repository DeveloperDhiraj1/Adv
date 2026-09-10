import mongoose from 'mongoose';

const callSessionSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExpertProfile',
      required: true
    },

    status: {
      type: String,
      enum: ['SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELLED'],
      default: 'SCHEDULED'
    },

    startedAt: {
      type: Date
    },

    endedAt: {
      type: Date
    },

    duration: {
      type: Number,
      default: 0
    },

    meetingLink: {
      type: String
    }
  },
  { timestamps: true }
);

const CallSession = mongoose.model('CallSession', callSessionSchema);

export default CallSession;