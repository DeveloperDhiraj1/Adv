import ExpertProfile from '../models/ExpertProfile.models.js';

export const createExpertProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { headline, bio, expertise, qualification, experienceYears, languages } = req.body;

    const existingProfile = await ExpertProfile.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Expert profile already exists for this user"
      });
    }

    const newProfile = new ExpertProfile({
      userId,
      headline,
      bio,
      expertise,
      qualification,
      experienceYears,
      languages
    });

    await newProfile.save();

    return res.status(201).json({
      success: true,
      message: "Expert profile created successfully",
      data: newProfile
    });

  } catch (error) {
    console.error("Expert Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const updateExpertProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { headline, bio, expertise, qualification, experienceYears, languages } = req.body;

    const profile = await ExpertProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Expert profile not found"
      });
    }

    const updatedProfile = await ExpertProfile.findByIdAndUpdate(
      profile._id,
      {
        headline: headline ?? profile.headline,
        bio: bio ?? profile.bio,
        expertise: expertise ?? profile.expertise,
        qualification: qualification ?? profile.qualification,
        experienceYears: experienceYears ?? profile.experienceYears,
        languages: languages ?? profile.languages,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Expert profile updated successfully",
      data: updatedProfile
    });
  } catch (error) {
    console.error("Update Expert Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};