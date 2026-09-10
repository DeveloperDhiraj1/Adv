import Service from '../models/Service.models.js';
import ExpertProfile from '../models/ExpertProfile.models.js';

export const createService = async (req, res) => {
  try {
    const userId = req.user.id;
    const { categoryId, title, description, duration, price, consultationType } = req.body;

    const expertProfile = await ExpertProfile.findOne({ userId });
    if (!expertProfile) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only registered experts can create services."
      });
    }

    const newService = new Service({
      expertId: expertProfile._id,
      categoryId,
      title,
      description,
      duration,
      price,
      consultationType
    });

    await newService.save();

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: newService
    });

  } catch (error) {
    console.error("Create Service Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// 2. getServices with Search, Filters, and Pagination
export const getServices = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    let query = { status: 'ACTIVE' };

    // Keyword search (Title ya Description mein)
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      query.categoryId = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Pagination calculation
    const skip = (Number(page) - 1) * Number(limit);

    const services = await Service.find(query)
      .populate('expertId', 'headline experienceYears rating languages')
      .populate('categoryId', 'name')
      .skip(skip)
      .limit(Number(limit));

    const total = await Service.countDocuments(query);

    return res.status(200).json({
      success: true,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalResults: total,
      count: services.length,
      data: services
    });

  } catch (error) {
    console.error("Get Services Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// 3. getServiceById - full detail for a single service (used by expert profile & booking pages)
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id)
      .populate('expertId')
      .populate('categoryId', 'name');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: service
    });

  } catch (error) {
    console.error("Get Service By Id Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// 4. getMyServices - all services (any status) belonging to the logged-in expert
export const getMyServices = async (req, res) => {
  try {
    const userId = req.user.id;
    const expertProfile = await ExpertProfile.findOne({ userId });

    if (!expertProfile) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only registered experts can view their services."
      });
    }

    const services = await Service.find({ expertId: expertProfile._id })
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: services
    });

  } catch (error) {
    console.error("Get My Services Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// 5. updateService - edit a service owned by the logged-in expert
export const updateService = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { categoryId, title, description, duration, price, consultationType, status } = req.body;

    const expertProfile = await ExpertProfile.findOne({ userId });
    if (!expertProfile) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only registered experts can update services."
      });
    }

    const service = await Service.findOne({ _id: id, expertId: expertProfile._id });
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    if (categoryId !== undefined) service.categoryId = categoryId;
    if (title !== undefined) service.title = title;
    if (description !== undefined) service.description = description;
    if (duration !== undefined) service.duration = duration;
    if (price !== undefined) service.price = price;
    if (consultationType !== undefined) service.consultationType = consultationType;
    if (status !== undefined) service.status = status;

    await service.save();

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: service
    });

  } catch (error) {
    console.error("Update Service Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// 6. deleteService - soft-delete (deactivate) a service owned by the logged-in expert
export const deleteService = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const expertProfile = await ExpertProfile.findOne({ userId });
    if (!expertProfile) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only registered experts can delete services."
      });
    }

    const service = await Service.findOneAndUpdate(
      { _id: id, expertId: expertProfile._id },
      { status: 'INACTIVE' },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service deactivated successfully",
      data: service
    });

  } catch (error) {
    console.error("Delete Service Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};