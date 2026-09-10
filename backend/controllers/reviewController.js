import Review from '../models/Review.models.js';
import Booking from '../models/Booking.models.js';
import ExpertProfile from '../models/ExpertProfile.models.js';

export const addReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

  
    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized action" });
    }


    if (booking.bookingStatus !== 'COMPLETED') {
      return res.status(400).json({ success: false, message: "You can only review completed consultations" });
    }


    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: "Review already submitted for this booking" });
    }

   
    const newReview = new Review({
      userId,
      expertId: booking.expertId,
      bookingId,
      rating,
      comment
    });

    await newReview.save();

    
    const reviews = await Review.find({ expertId: booking.expertId });
    const totalRating = reviews.reduce((acc, item) => acc + item.rating, 0);
    const averageRating = reviews.length ? totalRating / reviews.length : 0;

    await ExpertProfile.findByIdAndUpdate(booking.expertId, {
      rating: Number(averageRating.toFixed(1)),
      totalReviews: reviews.length
    });

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: newReview
    });

  } catch (error) {
    console.error("Add Review Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const getExpertReviews = async (req, res) => {
  try {
    const { expertId } = req.params;

    const reviews = await Review.find({ expertId })
      .populate('userId', 'name');

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error("Get Reviews Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};