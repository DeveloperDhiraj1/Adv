import ExpertProfile from '../models/ExpertProfile.models.js';
import Service from '../models/Service.models.js';
import Booking from '../models/Booking.models.js';
import Review from '../models/Review.models.js';

export const getExpertDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    
    const expertProfile = await ExpertProfile.findOne({ userId });
    if (!expertProfile) {
      return res.status(404).json({ success: false, message: "Expert profile not found for this user" });
    }

    const expertId = expertProfile._id;

    
    const services = await Service.find({ expertId });

    
  const bookings = await Booking.find({
    expertId,
    paymentStatus: 'PAID',
  }).populate('userId', 'name email')
    .populate('serviceId', 'title price')
    .sort({ createdAt: -1 });

    
    const paidBookings = bookings.filter(b => b.paymentStatus === 'PAID');
    const totalEarnings = paidBookings.reduce((acc, curr) => acc + (curr.amount || 0), 0);


    const reviews = await Review.find({ expertId })
      .populate('userId', 'name');

    return res.status(200).json({
      success: true,
      data: {
        profile: expertProfile,
        stats: {
          totalServices: services.length,
          totalBookings: bookings.length,
          totalEarnings,
          rating: expertProfile.rating,
          totalReviews: expertProfile.totalReviews
        },
        services,
        bookings,
        reviews
      }
    });

  } catch (error) {
    console.error("Expert Dashboard Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};