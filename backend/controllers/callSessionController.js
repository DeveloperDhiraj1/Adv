import CallSession from '../models/CallSession.models.js';
import Booking from '../models/Booking.models.js';
import Notification from '../models/Notification.models.js';

export const createCallSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookingId, meetingLink } = req.body;

    const booking = await Booking.findOne({
      _id: bookingId,
      userId,
      paymentStatus: 'PAID',
      bookingStatus: 'CONFIRMED'
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Confirmed paid booking not found'
      });
    }

    const existingSession = await CallSession.findOne({ bookingId });

    if (existingSession) {
      return res.status(400).json({
        success: false,
        message: 'Call session already exists'
      });
    }

    const session = await CallSession.create({
      bookingId,
      userId: booking.userId,
      expertId: booking.expertId,
      meetingLink: meetingLink || booking.meetingLink
    });

    await Notification.create({
      userId,
      type: 'CALL',
      title: 'Call Session Created',
      message: 'Your advisory call session is ready.',
      bookingId
    });

    return res.status(201).json({
      success: true,
      message: 'Call session created successfully',
      data: session
    });
  } catch (error) {
    console.error('Create Call Session Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const startCallSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookingId } = req.params;

    const session = await CallSession.findOne({
      bookingId,
      userId
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Call session not found'
      });
    }

    if (session.status !== 'SCHEDULED') {
      return res.status(400).json({
        success: false,
        message: 'Call session cannot be started'
      });
    }

    session.status = 'ACTIVE';
    session.startedAt = new Date();

    await session.save();

    return res.status(200).json({
      success: true,
      message: 'Call session started',
      data: session
    });
  } catch (error) {
    console.error('Start Call Session Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const endCallSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookingId } = req.params;

    const session = await CallSession.findOne({
      bookingId,
      userId
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Call session not found'
      });
    }

    if (session.status !== 'ACTIVE') {
      return res.status(400).json({
        success: false,
        message: 'Call session is not active'
      });
    }

    session.endedAt = new Date();
    session.status = 'COMPLETED';

    if (session.startedAt) {
      session.duration = Math.round(
        (session.endedAt - session.startedAt) / 1000
      );
    }

    await session.save();

    await Booking.findByIdAndUpdate(session.bookingId, {
      bookingStatus: 'COMPLETED'
    });

    await Notification.create({
      userId,
      type: 'CALL',
      title: 'Call Completed',
      message: 'Your advisory call has been completed.',
      bookingId: session.bookingId
    });

    return res.status(200).json({
      success: true,
      message: 'Call session ended',
      data: session
    });
  } catch (error) {
    console.error('End Call Session Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getMyCallSessions = async (req, res) => {
  try {
    const sessions = await CallSession.find({
      userId: req.user.id
    })
      .populate('bookingId')
      .populate('expertId');

    return res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    console.error('Get Call Sessions Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};