import Availability from '../models/Availability.models.js';
import ExpertProfile from '../models/ExpertProfile.models.js';


export const setAvailability = async (req, res) => {
  try {
    const userId = req.user.id;
    const { dayOfWeek, startTime, endTime, isAvailable } = req.body;

    const expertProfile = await ExpertProfile.findOne({ userId });
    if (!expertProfile) {
      return res.status(404).json({ success: false, message: "Expert profile not found" });
    }

    // Look up by both dayOfWeek and startTime to support multiple slots per day
    let availability = await Availability.findOne({
      expertId: expertProfile._id,
      dayOfWeek,
      startTime
    });

    if (availability) {
      // Update existing slot
      availability.endTime = endTime || availability.endTime;
      availability.isAvailable = isAvailable !== undefined ? isAvailable : availability.isAvailable;
      await availability.save();
    } else if (isAvailable) {
      // Create new slot only if isAvailable is true
      availability = new Availability({
        expertId: expertProfile._id,
        dayOfWeek,
        startTime,
        endTime: endTime || startTime,
        isAvailable: true
      });
      await availability.save();
    }

    return res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      data: availability
    });

  } catch (error) {
    console.error("Set Availability Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const getExpertAvailability = async (req, res) => {
  try {
    const { expertId } = req.params;

    const availabilities = await Availability.find({ expertId, isAvailable: true });

    return res.status(200).json({
      success: true,
      count: availabilities.length,
      data: availabilities
    });

  } catch (error) {
    console.error("Get Availability Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const getMyAvailability = async (req, res) => {
  try {
    const userId = req.user.id;

    const expertProfile = await ExpertProfile.findOne({ userId });
    if (!expertProfile) {
      return res.status(404).json({ success: false, message: "Expert profile not found" });
    }

    const availabilities = await Availability.find({ expertId: expertProfile._id });

    return res.status(200).json({
      success: true,
      count: availabilities.length,
      data: availabilities
    });

  } catch (error) {
    console.error("Get My Availability Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};