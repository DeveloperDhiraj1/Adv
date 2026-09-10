import mongoose from 'mongoose';

const payoutSchema = new mongoose.Schema(
  {
    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExpertProfile',
      required: true
    },

    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true
    },

    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
      default: 'PENDING'
    },

    processedAt: {
      type: Date
    },

    transactionId: {
      type: String
    },

    failureReason: {
      type: String
    }
  },
  { timestamps: true }
);

const Payout = mongoose.model('Payout', payoutSchema);

export default Payout;