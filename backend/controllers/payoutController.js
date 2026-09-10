import Payout from '../models/Payout.models.js';
import Booking from '../models/Booking.models.js';
import Payment from '../models/Payment.models.js';
import Notification from '../models/Notification.models.js';
import ExpertProfile from '../models/ExpertProfile.models.js';

export const createPayout = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findOne({
      _id: bookingId,
      bookingStatus: 'COMPLETED',
      paymentStatus: 'PAID'
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Completed paid booking not found'
      });
    }

    const payment = await Payment.findOne({
      bookingId,
      paymentStatus: 'SUCCESS'
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Successful payment not found'
      });
    }

    const existingPayout = await Payout.findOne({ bookingId });

    if (existingPayout) {
      return res.status(400).json({
        success: false,
        message: 'Payout already exists for this booking'
      });
    }

    const payout = await Payout.create({
      expertId: booking.expertId,
      bookingId,
      paymentId: payment._id,
      amount: payment.amount,
      status: 'PENDING'
    });

    return res.status(201).json({
      success: true,
      message: 'Payout created successfully',
      data: payout
    });
  } catch (error) {
    console.error('Create Payout Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getExpertPayouts = async (req, res) => {
  try {
    const expertProfile = await ExpertProfile.findOne({ userId: req.user.id });

    if (!expertProfile) {
      return res.status(404).json({
        success: false,
        message: 'Expert profile not found for this user'
      });
    }

    const payouts = await Payout.find({
      expertId: expertProfile._id
    })
      .populate('bookingId')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: payouts.length,
      data: payouts
    });
  } catch (error) {
    console.error('Get Expert Payouts Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};