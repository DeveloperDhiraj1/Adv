import Dispute from '../models/Dispute.models.js';
import Booking from '../models/Booking.models.js';
import Notification from '../models/Notification.models.js';

export const createDispute = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookingId, reason, description } = req.body;

    if (!bookingId || !reason || !description) {
      return res.status(400).json({
        success: false,
        message: 'bookingId, reason and description are required'
      });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      userId
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const existingDispute = await Dispute.findOne({
      bookingId,
      raisedBy: userId,
      status: { $in: ['PENDING', 'UNDER_REVIEW'] }
    });

    if (existingDispute) {
      return res.status(400).json({
        success: false,
        message: 'An active dispute already exists for this booking'
      });
    }

    const dispute = await Dispute.create({
      bookingId,
      raisedBy: userId,
      reason,
      description
    });

    await Notification.create({
      userId,
      type: 'DISPUTE',
      title: 'Dispute Created',
      message: 'Your dispute has been submitted for review.',
      bookingId
    });

    return res.status(201).json({
      success: true,
      message: 'Dispute created successfully',
      data: dispute
    });
  } catch (error) {
    console.error('Create Dispute Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getMyDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.find({
      raisedBy: req.user.id
    })
      .populate('bookingId')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: disputes.length,
      data: disputes
    });
  } catch (error) {
    console.error('Get Disputes Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};