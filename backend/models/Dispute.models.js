import mongoose from 'mongoose';

const disputeSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    },

    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    reason: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: ['PENDING', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED'],
      default: 'PENDING'
    },

    resolution: {
      type: String,
      trim: true
    },

    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    resolvedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

const Dispute = mongoose.model('Dispute', disputeSchema);

export default Dispute;