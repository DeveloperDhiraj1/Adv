import User from '../models/user.model.js';
import ExpertProfile from '../models/ExpertProfile.models.js';
import Service from '../models/Service.models.js';
import Booking from '../models/Booking.models.js';
import Dispute from '../models/Dispute.models.js';
import Payment from '../models/Payment.models.js';


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error("Get All Users Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const getAllExperts = async (req, res) => {
  try {
    const experts = await ExpertProfile.find().populate('userId', 'name email isVerified');
    return res.status(200).json({
      success: true,
      count: experts.length,
      data: experts
    });
  } catch (error) {
    console.error("Get All Experts Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'USER' });
    const totalExperts = await ExpertProfile.countDocuments();
    const totalServices = await Service.countDocuments({ status: 'ACTIVE' });
    const totalBookings = await Booking.countDocuments();

    
    const paidBookings = await Booking.find({ paymentStatus: 'PAID' });
    const totalRevenue = paidBookings.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    // Get recent bookings for analytics
    const recentBookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('expertId', 'headline')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get disputes
    const openDisputes = await Dispute.countDocuments({ status: { $in: ['OPEN', 'IN_PROGRESS'] } });

    // Get expert verification status
    const unverifiedExperts = await ExpertProfile.countDocuments({ isVerified: false });

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalExperts,
        totalServices,
        totalBookings,
        totalRevenue,
        openDisputes,
        unverifiedExperts,
        recentBookings
      }
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User deactivated successfully",
      data: user
    });
  } catch (error) {
    console.error("Deactivate User Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const activateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User activated successfully",
      data: user
    });
  } catch (error) {
    console.error("Activate User Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const verifyExpert = async (req, res) => {
  try {
    const { expertId } = req.params;

    const expert = await ExpertProfile.findByIdAndUpdate(
      expertId,
      { isVerified: true, verificationStatus: 'VERIFIED' },
      { new: true }
    ).populate('userId', 'name email');

    if (!expert) {
      return res.status(404).json({ success: false, message: "Expert not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Expert verified successfully",
      data: expert
    });
  } catch (error) {
    console.error("Verify Expert Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const rejectExpert = async (req, res) => {
  try {
    const { expertId } = req.params;

    const expert = await ExpertProfile.findByIdAndUpdate(
      expertId,
      { isVerified: false, verificationStatus: 'REJECTED' },
      { new: true }
    ).populate('userId', 'name email');

    if (!expert) {
      return res.status(404).json({ success: false, message: "Expert not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Expert rejected",
      data: expert
    });
  } catch (error) {
    console.error("Reject Expert Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.find()
      .populate('bookingId')
      .populate('initiatedBy', 'name role')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: disputes.length,
      data: disputes
    });
  } catch (error) {
    console.error("Get Disputes Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const resolveDispute = async (req, res) => {
  try {
    const { disputeId } = req.params;
    const { resolution, status } = req.body;

    const dispute = await Dispute.findByIdAndUpdate(
      disputeId,
      { resolution, status: status || 'RESOLVED', resolvedAt: new Date() },
      { new: true }
    ).populate('bookingId');

    if (!dispute) {
      return res.status(404).json({ success: false, message: "Dispute not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Dispute resolved",
      data: dispute
    });
  } catch (error) {
    console.error("Resolve Dispute Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Payment.find()
      .populate('userId', 'name email')
      .populate('bookingId')
      .sort({ createdAt: -1 })
      .limit(50);

    const totalAmount = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

    return res.status(200).json({
      success: true,
      count: transactions.length,
      totalAmount,
      data: transactions
    });
  } catch (error) {
    console.error("Get Transactions Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};