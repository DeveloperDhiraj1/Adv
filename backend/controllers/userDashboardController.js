import User from '../models/user.model.js';
import Booking from '../models/Booking.models.js';
import Review from '../models/Review.models.js';

export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    
  const bookings = await Booking.find({
    userId,
    paymentStatus: 'PAID',
  })
  .populate('serviceId', 'title price category')
  .populate('expertId')
  .sort({ createdAt: -1 });

  
    const reviews = await Review.find({ userId })
      .populate('expertId')
      .populate('serviceId', 'title');

    return res.status(200).json({
      success: true,
      data: {
        profile: user,
        totalBookings: bookings.length,
        bookings,
        reviews
      }
    });

  } catch (error) {
    console.error("User Dashboard Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        ...(name !== undefined ? { name } : {}),
        ...(phone !== undefined ? { phone } : {}),
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user
    });
  } catch (error) {
    console.error("Update User Profile Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};