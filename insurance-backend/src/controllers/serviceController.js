const Service = require('../models/Servicea');
const ServiceApplication = require('../models/ServiceApplication');
const User = require('../models/User');
const Policy = require('../models/Policy'); // Uncomment if needed
 const asyncHandler = require('express-async-handler'); // Uncomment if needed

// ==========================================
// SERVICE MANAGEMENT (Admin)
// ==========================================
exports.hello = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Service controller is working'
  });
};
/**
 * @desc    Get all services
 * @route   GET /api/services
 * @access  Public
 */
exports.getAllServices = async (req, res) => {
  try {
    const { category, search, isActive = 'true' } = req.query;
    
    let query = { isActive: isActive === 'true' };
    
    if (category && category !== 'all') {
      if (category === 'life') {
        query.category = { $in: ['life', 'health'] };
      } else if (category === 'property') {
        query.category = { $in: ['property', 'motor'] };
      } else if (category === 'business') {
        query.category = { $in: ['business', 'group'] };
      } else {
        query.category = category;
      }
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    const services = await Service.find(query)
      .sort({ popularityScore: -1, name: 1 });
    
    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get single service
 * @route   GET /api/services/:id
 * @access  Public
 */
exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Create service (Admin)
 * @route   POST /api/services
 * @access  Private (Admin)
 */
exports.createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update service (Admin)
 * @route   PUT /api/services/:id
 * @access  Private (Admin)
 */
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Delete service (Admin)
 * @route   DELETE /api/services/:id
 * @access  Private (Admin)
 */
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==========================================
// SERVICE APPLICATIONS
// ==========================================

/**
 * @desc    Submit service application
 * @route   POST /api/services/applications
 * @access  Private (Client)
 */
exports.submitApplication = async (req, res) => {
  try {
    const {
      serviceId,
      serviceName,
      fullName,
      email,
      phone,
      dateOfBirth,
      idNumber,
      address,
      message,
      preferredContactMethod,
      preferredContactTime
    } = req.body;
    
    // Verify service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    if (!service.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This service is currently unavailable'
      });
    }
    
    // Create application
    const application = await ServiceApplication.create({
      user: req.user.id,
      service: serviceId,
      serviceName: serviceName || service.name,
      applicantInfo: {
        fullName,
        email,
        phone,
        dateOfBirth,
        idNumber,
        address
      },
      additionalInfo: {
        message,
        preferredContactMethod,
        preferredContactTime
      }
    });
    
    // Increment service popularity
    service.popularityScore += 1;
    await service.save();
    
    const populatedApp = await ServiceApplication.findById(application._id)
      .populate('service', 'name category premiumRange')
      .populate('user', 'firstName lastName email phone');
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully. We will contact you soon.',
      data: populatedApp
    });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error submitting application'
    });
  }
};

/**
 * @desc    Get user's applications
 * @route   GET /api/services/applications/my-applications
 * @access  Private (Client)
 */
exports.getMyApplications = async (req, res) => {
  try {
    const { status, sortBy = '-createdAt', page = 1, limit = 10 } = req.query;
    
    let query = { user: req.user.id };
    if (status) query.status = status;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const applications = await ServiceApplication.find(query)
      .populate('service', 'name category premiumRange')
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-notes'); // Hide internal notes from client
    
    const total = await ServiceApplication.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: applications.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get all applications (Admin, Agent)
 * @route   GET /api/services/applications
 * @access  Private (Admin, Agent)
 */
exports.getAllApplications = async (req, res) => {
  try {
    const { 
      status, 
      priority, 
      assignedTo,
      startDate,
      endDate,
      search,
      sortBy = '-createdAt', 
      page = 1, 
      limit = 20 
    } = req.query;
    
    let query = {};
    
    // Role-based filtering
    if (req.user.role === 'agent') {
      query.$or = [
        { assignedTo: req.user.id },
        { assignedTo: { $exists: false } },
        { assignedTo: null }
      ];
    }
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;
    
    // Date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    // Search
    if (search) {
      query.$or = [
        { applicationNumber: { $regex: search, $options: 'i' } },
        { 'applicantInfo.fullName': { $regex: search, $options: 'i' } },
        { 'applicantInfo.email': { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const applications = await ServiceApplication.find(query)
      .populate('service', 'name category premiumRange')
      .populate('user', 'firstName lastName email phone')
      .populate('assignedTo', 'firstName lastName email')
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await ServiceApplication.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: applications.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get single application
 * @route   GET /api/services/applications/:id
 * @access  Private
 */
exports.getApplication = async (req, res) => {
  try {
    const application = await ServiceApplication.findById(req.params.id)
      .populate('service', 'name category premiumRange features')
      .populate('user', 'firstName lastName email phone')
      .populate('assignedTo', 'firstName lastName email')
      .populate('notes.addedBy', 'firstName lastName role')
      .populate('statusHistory.changedBy', 'firstName lastName role');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Check authorization
    const canAccess = 
      req.user.role === 'admin' ||
      (req.user.role === 'agent' && application.assignedTo?.toString() === req.user.id) ||
      (req.user.role === 'client' && application.user.toString() === req.user.id);
    
    if (!canAccess) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }
    
    // Hide internal notes from client
    if (req.user.role === 'client') {
      application.notes = application.notes.filter(n => !n.isInternal);
    }
    
    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Assign application (Admin, Agent)
 * @route   PUT /api/services/applications/:id/assign
 * @access  Private (Admin, Agent)
 */
exports.assignApplication = async (req, res) => {
  try {
    const { agentId } = req.body;
    const application = await ServiceApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Agents can only assign to themselves
    if (req.user.role === 'agent' && agentId && agentId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Agents can only assign applications to themselves'
      });
    }
    
    const targetAgentId = agentId || req.user.id;
    
    // Verify agent exists
    const agent = await User.findById(targetAgentId);
    if (!agent || !['agent', 'admin'].includes(agent.role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid agent ID'
      });
    }
    
    application.assignedTo = targetAgentId;
    
    if (application.status === 'Submitted') {
      application.status = 'Under Review';
    }
    
    application.statusHistory.push({
      status: application.status,
      changedBy: req.user.id,
      changedAt: new Date(),
      comment: `Assigned to ${agent.firstName} ${agent.lastName}`
    });
    
    await application.save();
    
    const updatedApp = await ServiceApplication.findById(application._id)
      .populate('service', 'name category')
      .populate('user', 'firstName lastName email phone')
      .populate('assignedTo', 'firstName lastName email');
    
    res.status(200).json({
      success: true,
      message: 'Application assigned successfully',
      data: updatedApp
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Add note to application (Admin, Agent)
 * @route   POST /api/services/applications/:id/notes
 * @access  Private (Admin, Agent)
 */
exports.addNote = async (req, res) => {
  try {
    const { note, isInternal = true } = req.body;
    const application = await ServiceApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Check access for agents
    if (req.user.role === 'agent' && application.assignedTo?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add notes to this application'
      });
    }
    
    if (!note || note.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Note cannot be empty'
      });
    }
    
    await application.addNote(req.user.id, note, isInternal);
    
    const updatedApp = await ServiceApplication.findById(application._id)
      .populate('notes.addedBy', 'firstName lastName email');
    
    res.status(200).json({
      success: true,
      message: 'Note added successfully',
      data: updatedApp
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Approve application (Admin)
 * @route   PUT /api/services/applications/:id/approve
 * @access  Private (Admin)
 */
exports.approveApplication = async (req, res) => {
  try {
    const { comment } = req.body;
    const application = await ServiceApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    await application.approve(req.user.id, comment);
    
    const updatedApp = await ServiceApplication.findById(application._id)
      .populate('service', 'name category')
      .populate('user', 'firstName lastName email phone');
    
    res.status(200).json({
      success: true,
      message: 'Application approved successfully',
      data: updatedApp
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Reject application (Admin)
 * @route   PUT /api/services/applications/:id/reject
 * @access  Private (Admin)
 */
exports.rejectApplication = async (req, res) => {
  try {
    const { reason } = req.body;
    
    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }
    
    const application = await ServiceApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    await application.reject(req.user.id, reason);
    
    const updatedApp = await ServiceApplication.findById(application._id)
      .populate('service', 'name category')
      .populate('user', 'firstName lastName email phone');
    
    res.status(200).json({
      success: true,
      message: 'Application rejected',
      data: updatedApp
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Convert application to policy (Admin)
 * @route   PUT /api/services/applications/:id/convert
 * @access  Private (Admin)
 */
exports.convertToPolicy = async (req, res) => {
  try {
    const { policyNumber } = req.body;
    
    if (!policyNumber) {
      return res.status(400).json({
        success: false,
        message: 'Policy number is required'
      });
    }
    
    const application = await ServiceApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    if (application.status !== 'Approved') {
      return res.status(400).json({
        success: false,
        message: 'Only approved applications can be converted to policies'
      });
    }
    
    await application.convertToPolicy(req.user.id, policyNumber);
    
    const updatedApp = await ServiceApplication.findById(application._id)
      .populate('service', 'name category')
      .populate('user', 'firstName lastName email phone');
    
    res.status(200).json({
      success: true,
      message: 'Application converted to policy successfully',
      data: updatedApp
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get application statistics
 * @route   GET /api/services/applications/stats
 * @access  Private (Admin, Agent)
 */
exports.getApplicationStats = async (req, res) => {
  try {
    let query = {};
    
    // Role-based filtering
    if (req.user.role === 'agent') {
      query.assignedTo = req.user.id;
    }
    
    const total = await ServiceApplication.countDocuments(query);
    const submitted = await ServiceApplication.countDocuments({ ...query, status: 'Submitted' });
    const underReview = await ServiceApplication.countDocuments({ ...query, status: 'Under Review' });
    const approved = await ServiceApplication.countDocuments({ ...query, status: 'Approved' });
    const rejected = await ServiceApplication.countDocuments({ ...query, status: 'Rejected' });
    const converted = await ServiceApplication.countDocuments({ ...query, status: 'Converted to Policy' });
    
    // By service
    const byService = await ServiceApplication.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$serviceName',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Recent applications (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentApplications = await ServiceApplication.countDocuments({
      ...query,
      createdAt: { $gte: sevenDaysAgo }
    });
    
    res.status(200).json({
      success: true,
      data: {
        overview: {
          total,
          submitted,
          underReview,
          approved,
          rejected,
          converted,
          recentApplications
        },
        byService
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// =====================================================

// END OF SERVICE CONTROLLER