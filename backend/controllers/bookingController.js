import Booking from '../models/Booking.models.js';
import Service from '../models/Service.models.js';
import ExpertProfile from "../models/ExpertProfile.models.js";


export const createBooking = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { serviceId, scheduledAt } = req.body;

    
    const service = await Service.findById(serviceId);
    if (!service || service.status !== 'ACTIVE') {
      return res.status(404).json({
        success: false,
        message: "Service not found or inactive"
      });
    }


    const newBooking = new Booking({
      userId,
      expertId: service.expertId,
      serviceId,
      scheduledAt,
      amount: service.price
    });

    await newBooking.save();

    return res.status(201).json({
      success: true,
      message: "Booking request created successfully",
      data: newBooking
    });

  } catch (error) {
    console.error("Create Booking Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.find({
      userId,
      paymentStatus: 'PAID',
    }).populate('expertId')
      .populate('serviceId', 'title duration price consultationType');

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error("Get Bookings Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const addMeetingLink = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { meetingLink } = req.body;
    
    const expertProfile = await ExpertProfile.findOne({
      userId: req.user.id,
    });

    if (!expertProfile) {
      return res.status(404).json({
        message: "Expert profile not found",
      });
    }

    const expertId = expertProfile._id;

    if (!meetingLink) {
      return res.status(400).json({
        message: "Meeting link is required",
      });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      expertId,
      paymentStatus: "PAID",
      bookingStatus: "CONFIRMED",
    });

    if (!booking) {
      return res.status(404).json({
        message: "Confirmed booking not found",
      });
    }

    booking.meetingLink = meetingLink;
    await booking.save();

    res.json({
      message: "Meeting link shared successfully",
      booking,
    });
  } catch (error) {
    console.error("Add meeting link error:", error);

    res.status(500).json({
      message: "Failed to add meeting link",
    });
  }
};