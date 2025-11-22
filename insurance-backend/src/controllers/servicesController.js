const Service = require("../models/service.js");
const ServiceApplication = require("../models/ServiceApplication.js");
const asyncHandler = require("express-async-handler");

// ✅ Get all services (Public)
exports.getAllServices = asyncHandler(async (req, res) => {
  const { category, search, status } = req.query;

  const filter = {};
  
  // Filter by category if provided
  if (category && category !== 'all') {
    filter.category = category;
  }
  
  // Filter by status (active/inactive)
  if (status) {
    filter.status = status;
  } else {
    // By default, only show active services
    filter.status = 'active';
  }
  
  // Search by name or description
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const services = await Service.find(filter).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: services.length,
    services
  });
});

// ✅ Get single service by ID (Public)
exports.getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: "Service not found"
    });
  }

  res.json({
    success: true,
    service
  });
});

// ✅ Create new service (Admin only)
exports.createService = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    premium,
    features,
    benefits,
    coverage,
    exclusions,
    requirements,
    status
  } = req.body;

  // Validate required fields
  if (!name || !description || !category || !premium) {
    return res.status(400).json({
      success: false,
      message: "Please provide name, description, category, and premium"
    });
  }

  const service = await Service.create({
    name,
    description,
    category,
    premium,
    features,
    benefits,
    coverage,
    exclusions,
    requirements,
    status: status || 'active',
    createdBy: req.user.id
  });

  res.status(201).json({
    success: true,
    message: "Service created successfully",
    service
  });
});

// ✅ Update service (Admin only)
exports.updateService = asyncHandler(async (req, res) => {
  let service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: "Service not found"
    });
  }

  service = await Service.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedBy: req.user.id },
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: "Service updated successfully",
    service
  });
});

// ✅ Delete service (Admin only)
exports.deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: "Service not found"
    });
  }

  await service.deleteOne();

  res.json({
    success: true,
    message: "Service deleted successfully"
  });
});

// ✅ Submit service application (Client)
exports.submitApplication = asyncHandler(async (req, res) => {
  const { serviceId, fullName, phone, email, message } = req.body;

  // Validate required fields
  if (!serviceId || !fullName || !phone || !email) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields"
    });
  }

  // Verify service exists
  const service = await Service.findById(serviceId);
  if (!service) {
    return res.status(404).json({
      success: false,
      message: "Service not found"
    });
  }

  const application = await ServiceApplication.create({
    user: req.user.id,
    service: serviceId,
    fullName,
    phone,
    email,
    message,
    status: 'pending'
  });

  // Populate service details
  await application.populate('service', 'name category premium');

  res.status(201).json({
    success: true,
    message: "Application submitted successfully. Our team will contact you soon.",
    application
  });
});

// ✅ Get my applications (Client)
exports.getMyApplications = asyncHandler(async (req, res) => {
  const applications = await ServiceApplication.find({ user: req.user.id })
    .populate('service', 'name category premium description')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: applications.length,
    applications
  });
});

// ✅ Get all applications (Admin)
exports.getAllApplications = asyncHandler(async (req, res) => {
  const { status, serviceId } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (serviceId) filter.service = serviceId;

  const applications = await ServiceApplication.find(filter)
    .populate('user', 'firstName lastName email phone')
    .populate('service', 'name category premium')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: applications.length,
    applications
  });
});

// ✅ Update application status (Admin)
exports.updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;

  if (!['pending', 'reviewed', 'approved', 'rejected', 'completed'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status value"
    });
  }

  const application = await ServiceApplication.findById(req.params.id);

  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Application not found"
    });
  }

  application.status = status;
  if (adminNotes) application.adminNotes = adminNotes;
  application.reviewedBy = req.user.id;
  application.reviewedAt = Date.now();

  await application.save();

  await application.populate([
    { path: 'user', select: 'firstName lastName email phone' },
    { path: 'service', select: 'name category premium' }
  ]);

  res.json({
    success: true,
    message: "Application status updated successfully",
    application
  });
});

// ✅ Get service categories with counts (Public)
exports.getServiceCategories = asyncHandler(async (req, res) => {
  const categories = await Service.aggregate([
    { $match: { status: 'active' } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  const formattedCategories = categories.map(cat => ({
    category: cat._id,
    count: cat.count
  }));

  res.json({
    success: true,
    categories: formattedCategories
  });
});