const Claim = require('../models/Claim');
const Policy = require('../models/Policy');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;
const path = require('path');



// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ==========================================
// CONSTANTS
// ==========================================

const CLAIM_STATUS = {
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  DOCS_REQUIRED: 'Documents Required',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  PAID: 'Paid',
  CLOSED: 'Closed'
};

const PRIORITY_LEVELS = ['low', 'medium', 'high', 'urgent'];

const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Create standardized API response
 */
const sendResponse = (res, statusCode, success, message, data = null, meta = null) => {
  const response = { success, message };
  if (data !== null) response.data = data;
  if (meta !== null) response.meta = meta;
  return res.status(statusCode).json(response);
};

/**
 * Handle async errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Validate file upload
 */
const validateFile = (file) => {
  if (!file) {
    throw new Error('No file provided');
  }
  
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    throw new Error(`Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`);
  }
  
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }
  
  return true;
};

/**
 * Upload file to Cloudinary with error handling
 */
const uploadToCloud = async (file) => {
  try {
    validateFile(file);
    
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'claims',
      resource_type: 'auto',
      timeout: 60000,
      transformation: file.mimetype.startsWith('image/') ? [
        { quality: 'auto', fetch_format: 'auto' }
      ] : undefined
    });

    // Clean up local file
    try {
      await fs.unlink(file.path);
    } catch (unlinkError) {
      console.error('Error deleting local file:', unlinkError);
    }

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes
    };
  } catch (error) {
    // Clean up local file on error
    try {
      if (file.path) await fs.unlink(file.path);
    } catch (unlinkError) {
      console.error('Error deleting local file on error:', unlinkError);
    }
    throw new Error(`File upload failed: ${error.message}`);
  }
};

/**
 * Delete file from Cloudinary with error handling
 */
const deleteFromCloud = async (publicId) => {
  try {
    if (!publicId) return;
    
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'auto'
    });
    
    return result;
  } catch (error) {
    console.error('Error deleting from cloud:', error);
    // Don't throw - log and continue
  }
};

/**
 * Extract public ID from Cloudinary URL
 */
const extractPublicId = (url) => {
  if (!url) return null;
  const matches = url.match(/\/claims\/([^\.]+)/);
  return matches ? `claims/${matches[1]}` : null;
};

/**
 * Check if user has permission to access claim
 */
const hasClaimAccess = (claim, user) => {
  if (['admin', 'agent'].includes(user.role)) {
    return true;
  }
  
  if (user.role === 'client') {
    return claim.user.toString() === user.id;
  }
  
  return false;
};

/**
 * Get claims query based on user role and filters
 */
const buildClaimsQuery = (user, filters = {}) => {
  const query = { ...filters };
  
  // Role-based filtering
  if (user.role === 'client') {
    query.user = user.id;
  } else if (user.role === 'agent') {
    query.$or = [
      { assignedTo: user.id },
      { assignedTo: { $exists: false } },
      { assignedTo: null }
    ];
  }
  
  return query;
};

/**
 * Build pagination metadata
 */
const buildPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

/**
 * Send notification (placeholder for actual implementation)
 */
const sendNotification = async (type, recipient, claim, additionalData = {}) => {
  try {
    // Implement your notification service here
    // Email, SMS, Push notifications, etc.
    console.log(`📧 Notification sent: ${type} to ${recipient.email} for claim ${claim.claimNumber}`);
    
    // Example: Send email using nodemailer, SendGrid, etc.
    // await emailService.send({
    //   to: recipient.email,
    //   subject: `Claim ${claim.claimNumber} - ${type}`,
    //   template: type,
    //   data: { claim, ...additionalData }
    // });
    
    return true;
  } catch (error) {
    console.error('Notification error:', error);
    // Don't throw - notifications shouldn't break the main flow
    return false;
  }
};

/**
 * Sanitize claim data for client view
 */
const sanitizeClaimForClient = (claim) => {
  if (claim.toObject) claim = claim.toObject();
  
  // Remove sensitive fields
  delete claim.notes;
  delete claim.__v;
  
  return claim;
};

/**
 * Validate claim amount
 */
const validateClaimAmount = (amount, policy) => {
  if (amount <= 0) {
    throw new Error('Claim amount must be greater than zero');
  }
  
  if (policy.coverageAmount && amount > policy.coverageAmount) {
    throw new Error(`Claim amount exceeds policy coverage limit of ${policy.coverageAmount}`);
  }
  
  return true;
};

// ==========================================
// CLIENT OPERATIONS
// ==========================================

/**
 * @desc    Submit new claim
 * @route   POST /api/claims
 * @access  Private (Client)
 */
exports.submitClaim = asyncHandler(async (req, res) => {
  const {
    policyNumber,
    policyType,
    claimType,
    incidentDate,
    claimAmount,
    description,
    location,
    witnesses,
    paymentDetails,
    documents, // array of uploaded docs: [{ documentType, fileName, fileUrl }]
  } = req.body;

  // Input validation
  if (!policyNumber || !claimType || !incidentDate || !claimAmount || !description) {
    return sendResponse(res, 400, false, 'Missing required fields');
  }

  // Verify policy exists and belongs to user
  const policy = await Policy.findOne({ 
    policyNumber,
    holder: req.user.id 
  });

  if (!policy) {
    return sendResponse(res, 404, false, 'Policy not found or does not belong to you');
  }

  // Validate policy status
  if (policy.status !== 'Active') {
    return sendResponse(res, 400, false, `Cannot submit claim for inactive policy. Status: ${policy.status}`);
  }

  // Validate policy type
  if (policy.type !== policyType) {
    return sendResponse(res, 400, false, `Policy type mismatch. Expected: ${policy.type}, Got: ${policyType}`);
  }

  // Validate claim amount
  try {
    validateClaimAmount(parseFloat(claimAmount), policy);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }

  // Validate incident date
  const incidentDateTime = new Date(incidentDate);
  if (incidentDateTime > new Date()) {
    return sendResponse(res, 400, false, 'Incident date cannot be in the future');
  }

  if (incidentDateTime < new Date(policy.startDate)) {
    return sendResponse(res, 400, false, 'Incident occurred before policy start date');
  }

  // Create claim
  const claim = await Claim.create({
    user: req.user.id,
    policyNumber,
    policyType,
    claimType,
    incidentDate: incidentDateTime,
    claimAmount: parseFloat(claimAmount),
    description: description.trim(),
    location: location?.trim(),
    witnesses: Array.isArray(witnesses) ? witnesses : [],
    paymentDetails: paymentDetails || {},
    documents: Array.isArray(documents) ? documents : [],
    status: CLAIM_STATUS.SUBMITTED, // "Submitted"
    priority: 'medium'
  });

  // Populate user data
  await claim.populate('user', 'firstName lastName email phone');

  // Send notifications to admins
  const admins = await User.find({ role: 'admin', isActive: true });
  for (const admin of admins) {
    await sendNotification('NEW_CLAIM', admin, claim);
  }

  return sendResponse(
    res, 
    201, 
    true, 
    'Claim submitted successfully. You will be notified of any updates.',
    claim
  );
});
/**
 * @desc    Upload claim documents
 * @route   POST /api/claims/:id/documents
 * @access  Private
 */
exports.uploadDocuments = asyncHandler(async (req, res) => {
  const claim = await Claim.findById(req.params.id);

  if (!claim) {
    return sendResponse(res, 404, false, 'Claim not found');
  }

  if (!hasClaimAccess(claim, req.user)) {
    return sendResponse(res, 403, false, 'Not authorized to upload documents for this claim');
  }

  if (!req.files || req.files.length === 0) {
    return sendResponse(res, 400, false, 'No files uploaded');
  }

  // Upload files with error handling
  const uploadedDocuments = [];
  const uploadErrors = [];
  
  for (let i = 0; i < req.files.length; i++) {
    try {
      const file = req.files[i];
      const documentType = req.body.documentTypes?.[i] || 'Other';

      const uploadResult = await uploadToCloud(file);

      uploadedDocuments.push({
        documentType,
        fileName: file.originalname,
        fileUrl: uploadResult.url,
        publicId: uploadResult.publicId,
        fileSize: uploadResult.size,
        uploadedBy: req.user.id,
        uploadedAt: new Date()
      });
    } catch (error) {
      uploadErrors.push({
        file: req.files[i].originalname,
        error: error.message
      });
    }
  }

  if (uploadedDocuments.length === 0) {
    return sendResponse(res, 400, false, 'All file uploads failed', { errors: uploadErrors });
  }

  // Add documents to claim
  claim.documents.push(...uploadedDocuments);
  
  // Update status if needed
  if (claim.status === CLAIM_STATUS.DOCS_REQUIRED) {
    claim.status = CLAIM_STATUS.UNDER_REVIEW;
    claim.statusHistory.push({
      status: CLAIM_STATUS.UNDER_REVIEW,
      changedBy: req.user.id,
      changedAt: new Date(),
      comment: `Documents uploaded by ${req.user.role}`
    });

    // Notify assigned agent
    if (claim.assignedTo) {
      const agent = await User.findById(claim.assignedTo);
      if (agent) {
        await sendNotification('DOCUMENTS_UPLOADED', agent, claim);
      }
    }
  }

  await claim.save();
  await claim.populate([
    { path: 'user', select: 'firstName lastName email phone' },
    { path: 'assignedTo', select: 'firstName lastName email' }
  ]);

  // Notify claimant
  const claimant = await User.findById(claim.user._id || claim.user);
  if (claimant) {
    await sendNotification('CLAIM_APPROVED', claimant, claim, { approvedAmount: parsedAmount });
  }

  return sendResponse(res, 200, true, 'Claim approved successfully', claim);
});

/**
 * @desc    Reject claim
 * @route   PUT /api/claims/:id/reject
 * @access  Private (Admin)
 */
exports.rejectClaim = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  
  if (!reason || reason.trim().length === 0) {
    return sendResponse(res, 400, false, 'Rejection reason is required');
  }

  const claim = await Claim.findById(req.params.id);

  if (!claim) {
    return sendResponse(res, 404, false, 'Claim not found');
  }

  if (![CLAIM_STATUS.UNDER_REVIEW, CLAIM_STATUS.SUBMITTED].includes(claim.status)) {
    return sendResponse(res, 400, false, `Cannot reject claim in ${claim.status} status`);
  }

  claim.status = CLAIM_STATUS.REJECTED;
  claim.rejectionReason = reason.trim();
  
  claim.statusHistory.push({
    status: CLAIM_STATUS.REJECTED,
    changedBy: req.user.id,
    changedAt: new Date(),
    comment: reason.trim()
  });

  await claim.save();
  await claim.populate([
    { path: 'user', select: 'firstName lastName email phone' },
    { path: 'assignedTo', select: 'firstName lastName email' }
  ]);

  // Notify claimant
  const claimant = await User.findById(claim.user._id || claim.user);
  if (claimant) {
    await sendNotification('CLAIM_REJECTED', claimant, claim, { reason });
  }

  return sendResponse(res, 200, true, 'Claim rejected', claim);
});

/**
 * @desc    Mark claim as paid
 * @route   PUT /api/claims/:id/mark-paid
 * @access  Private (Admin)
 */
exports.markAsPaid = asyncHandler(async (req, res) => {
  const { paymentDetails } = req.body;
  
  if (!paymentDetails || !paymentDetails.method || !paymentDetails.transactionId) {
    return sendResponse(
      res, 
      400, 
      false, 
      'Payment details (method and transactionId) are required'
    );
  }

  const claim = await Claim.findById(req.params.id);

  if (!claim) {
    return sendResponse(res, 404, false, 'Claim not found');
  }

  if (claim.status !== CLAIM_STATUS.APPROVED) {
    return sendResponse(res, 400, false, 'Can only mark approved claims as paid');
  }

  claim.status = CLAIM_STATUS.PAID;
  claim.paymentDetails = {
    ...paymentDetails,
    paidBy: req.user.id,
    paidAt: new Date()
  };
  
  claim.statusHistory.push({
    status: CLAIM_STATUS.PAID,
    changedBy: req.user.id,
    changedAt: new Date(),
    comment: `Payment processed via ${paymentDetails.method}`
  });

  await claim.save();
  await claim.populate([
    { path: 'user', select: 'firstName lastName email phone' },
    { path: 'assignedTo', select: 'firstName lastName email' }
  ]);

  // Notify claimant
  const claimant = await User.findById(claim.user._id || claim.user);
  if (claimant) {
    await sendNotification('CLAIM_PAID', claimant, claim, { paymentDetails });
  }

  return sendResponse(res, 200, true, 'Claim marked as paid successfully', claim);
});

/**
 * @desc    Delete claim
 * @route   DELETE /api/claims/:id
 * @access  Private (Admin)
 */
exports.deleteClaim = asyncHandler(async (req, res) => {
  const claim = await Claim.findById(req.params.id);

  if (!claim) {
    return sendResponse(res, 404, false, 'Claim not found');
  }

  // Prevent deletion of paid claims
  if (claim.status === CLAIM_STATUS.PAID) {
    return sendResponse(res, 400, false, 'Cannot delete paid claims');
  }

  // Delete associated documents from cloud storage
  if (claim.documents && claim.documents.length > 0) {
    for (const doc of claim.documents) {
      const publicId = doc.publicId || extractPublicId(doc.fileUrl);
      if (publicId) {
        await deleteFromCloud(publicId);
      }
    }
  }

  await claim.deleteOne();

  return sendResponse(res, 200, true, 'Claim deleted successfully', null);
});

/**
 * @desc    Reopen closed claim
 * @route   PUT /api/claims/:id/reopen
 * @access  Private (Admin)
 */
exports.reopenClaim = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  
  const claim = await Claim.findById(req.params.id);

  if (!claim) {
    return sendResponse(res, 404, false, 'Claim not found');
  }

  if (![CLAIM_STATUS.CLOSED, CLAIM_STATUS.REJECTED].includes(claim.status)) {
    return sendResponse(res, 400, false, 'Can only reopen closed or rejected claims');
  }

  const previousStatus = claim.status;
  claim.status = CLAIM_STATUS.UNDER_REVIEW;
  claim.rejectionReason = null;
  
  claim.statusHistory.push({
    status: CLAIM_STATUS.UNDER_REVIEW,
    changedBy: req.user.id,
    changedAt: new Date(),
    comment: `Reopened from ${previousStatus}${reason ? `: ${reason}` : ''}`
  });

  if (reason) {
    claim.notes.push({
      addedBy: req.user.id,
      note: `Claim reopened: ${reason}`,
      addedAt: new Date()
    });
  }

  await claim.save();
  await claim.populate([
    { path: 'user', select: 'firstName lastName email phone' },
    { path: 'assignedTo', select: 'firstName lastName email' }
  ]);

  // Notify claimant and assigned agent
  const claimant = await User.findById(claim.user._id || claim.user);
  if (claimant) {
    await sendNotification('CLAIM_REOPENED', claimant, claim, { reason });
  }

  if (claim.assignedTo) {
    const agent = await User.findById(claim.assignedTo._id || claim.assignedTo);
    if (agent) {
      await sendNotification('CLAIM_REOPENED', agent, claim, { reason });
    }
  }

  return sendResponse(res, 200, true, 'Claim reopened successfully', claim);
});

/**
 * @desc    Bulk assign claims
 * @route   POST /api/claims/bulk-assign
 * @access  Private (Admin)
 */
exports.bulkAssignClaims = asyncHandler(async (req, res) => {
  const { claimIds, agentId } = req.body;

  if (!claimIds || !Array.isArray(claimIds) || claimIds.length === 0) {
    return sendResponse(res, 400, false, 'Claim IDs array is required and cannot be empty');
  }

  if (!agentId) {
    return sendResponse(res, 400, false, 'Agent ID is required');
  }

  // Verify agent
  const agent = await User.findById(agentId);
  if (!agent || !['agent', 'admin'].includes(agent.role)) {
    return sendResponse(res, 400, false, 'Invalid agent ID');
  }

  if (!agent.isActive) {
    return sendResponse(res, 400, false, 'Cannot assign to inactive agent');
  }

  // Update claims
  const result = await Claim.updateMany(
    { 
      _id: { $in: claimIds },
      status: { $ne: CLAIM_STATUS.PAID } // Don't reassign paid claims
    },
    {
      $set: { 
        assignedTo: agentId,
        status: CLAIM_STATUS.UNDER_REVIEW
      },
      $push: {
        statusHistory: {
          status: CLAIM_STATUS.UNDER_REVIEW,
          changedBy: req.user.id,
          changedAt: new Date(),
          comment: `Bulk assigned to ${agent.firstName} ${agent.lastName}`
        }
      }
    }
  );

  // Notify agent
  if (result.modifiedCount > 0) {
    await sendNotification('BULK_CLAIMS_ASSIGNED', agent, null, { 
      count: result.modifiedCount 
    });
  }

  return sendResponse(
    res,
    200,
    true,
    `${result.modifiedCount} claim(s) assigned successfully`,
    { 
      totalRequested: claimIds.length,
      assigned: result.modifiedCount 
    }
  );
});

// ==========================================
// SHARED OPERATIONS
// ==========================================

/**
 * @desc    Get single claim details
 * @route   GET /api/claims/:id
 * @access  Private
 */
exports.getClaim = asyncHandler(async (req, res) => {
  const claim = await Claim.findById(req.params.id)
    .populate('user', 'firstName lastName email phone idNumber')
    .populate('assignedTo', 'firstName lastName email')
    .populate('notes.addedBy', 'firstName lastName role')
    .populate('statusHistory.changedBy', 'firstName lastName role');

  if (!claim) {
    return sendResponse(res, 404, false, 'Claim not found');
  }

  if (!hasClaimAccess(claim, req.user)) {
    return sendResponse(res, 403, false, 'Not authorized to view this claim');
  }

  // Sanitize for clients
  let responseData = claim;
  if (req.user.role === 'client') {
    responseData = sanitizeClaimForClient(claim);
  }

  return sendResponse(res, 200, true, 'Claim retrieved successfully', responseData);
});

/**
 * @desc    Get claim statistics
 * @route   GET /api/claims/stats
 * @access  Private (Admin, Agent)
 */
exports.getClaimStats = asyncHandler(async (req, res) => {
  const query = buildClaimsQuery(req.user);

  const [
    total,
    submitted,
    underReview,
    documentsRequired,
    approved,
    rejected,
    paid,
    closed,
    totalClaimAmount,
    approvedClaimAmount,
    paidClaimAmount,
    byType,
    byPolicyType,
    byPriority,
    avgProcessingTime,
    recentClaims
  ] = await Promise.all([
    Claim.countDocuments(query),
    Claim.countDocuments({ ...query, status: CLAIM_STATUS.SUBMITTED }),
    Claim.countDocuments({ ...query, status: CLAIM_STATUS.UNDER_REVIEW }),
    Claim.countDocuments({ ...query, status: CLAIM_STATUS.DOCS_REQUIRED }),
    Claim.countDocuments({ ...query, status: CLAIM_STATUS.APPROVED }),
    Claim.countDocuments({ ...query, status: CLAIM_STATUS.REJECTED }),
    Claim.countDocuments({ ...query, status: CLAIM_STATUS.PAID }),
    Claim.countDocuments({ ...query, status: CLAIM_STATUS.CLOSED }),
    
    // Total amounts
    Claim.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$claimAmount' } } }
    ]),
    
    Claim.aggregate([
      { $match: { ...query, status: { $in: [CLAIM_STATUS.APPROVED, CLAIM_STATUS.PAID] } } },
      { $group: { _id: null, total: { $sum: '$approvedAmount' } } }
    ]),
    
    Claim.aggregate([
      { $match: { ...query, status: CLAIM_STATUS.PAID } },
      { $group: { _id: null, total: { $sum: '$approvedAmount' } } }
    ]),
    
    // By type
    Claim.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$claimType',
          count: { $sum: 1 },
          totalAmount: { $sum: '$claimAmount' },
          approvedAmount: { $sum: '$approvedAmount' }
        }
      },
      { $sort: { count: -1 } }
    ]),
    
    // By policy type
    Claim.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$policyType',
          count: { $sum: 1 },
          totalAmount: { $sum: '$claimAmount' }
        }
      },
      { $sort: { count: -1 } }
    ]),
    
    // By priority
    Claim.aggregate([
      { $match: query },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]),
    
    // Average processing time
    Claim.aggregate([
      { 
        $match: { 
          ...query, 
          status: { $in: [CLAIM_STATUS.PAID, CLAIM_STATUS.CLOSED, CLAIM_STATUS.REJECTED] } 
        } 
      },
      {
        $project: {
          processingDays: {
            $divide: [
              { $subtract: ['$updatedAt', '$createdAt'] },
              1000 * 60 * 60 * 24
            ]
          }
        }
      },
      { $group: { _id: null, avgDays: { $avg: '$processingDays' } } }
    ]),
    
    // Recent claims (last 7 days)
    Claim.countDocuments({
      ...query,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    })
  ]);

  // Pending action items (for agents/admins)
  let pendingActions = null;
  if (['admin', 'agent'].includes(req.user.role)) {
    pendingActions = await Promise.all([
      Claim.countDocuments({ 
        ...query, 
        assignedTo: { $exists: false },
        status: CLAIM_STATUS.SUBMITTED
      }),
      Claim.countDocuments({ ...query, status: CLAIM_STATUS.UNDER_REVIEW }),
      Claim.countDocuments({ ...query, status: CLAIM_STATUS.DOCS_REQUIRED }),
      Claim.countDocuments({ 
        ...query, 
        status: CLAIM_STATUS.UNDER_REVIEW,
        assignedTo: { $exists: true }
      }),
      Claim.countDocuments({ ...query, status: CLAIM_STATUS.APPROVED })
    ]).then(([needsAssignment, needsReview, awaitingDocuments, readyForApproval, approvedNotPaid]) => ({
      needsAssignment,
      needsReview,
      awaitingDocuments,
      readyForApproval,
      approvedNotPaid
    }));
  }

  const stats = {
    overview: {
      total,
      submitted,
      underReview,
      documentsRequired,
      approved,
      rejected,
      paid,
      closed,
      recentClaims
    },
    amounts: {
      totalClaimed: totalClaimAmount[0]?.total || 0,
      totalApproved: approvedClaimAmount[0]?.total || 0,
      totalPaid: paidClaimAmount[0]?.total || 0
    },
    byType,
    byPolicyType,
    byPriority,
    avgProcessingDays: avgProcessingTime[0]?.avgDays?.toFixed(1) || 0,
    pendingActions
  };

  return sendResponse(res, 200, true, 'Statistics retrieved successfully', stats);
});

/**
 * @desc    Get user's claim statistics
 * @route   GET /api/claims/my-stats
 * @access  Private (Client)
 */
exports.getMyClaimStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [
    total,
    submitted,
    underReview,
    approved,
    rejected,
    paid,
    closed,
    totalClaimed,
    totalApproved,
    recentClaims
  ] = await Promise.all([
    Claim.countDocuments({ user: userId }),
    Claim.countDocuments({ user: userId, status: CLAIM_STATUS.SUBMITTED }),
    Claim.countDocuments({ user: userId, status: CLAIM_STATUS.UNDER_REVIEW }),
    Claim.countDocuments({ user: userId, status: CLAIM_STATUS.APPROVED }),
    Claim.countDocuments({ user: userId, status: CLAIM_STATUS.REJECTED }),
    Claim.countDocuments({ user: userId, status: CLAIM_STATUS.PAID }),
    Claim.countDocuments({ user: userId, status: CLAIM_STATUS.CLOSED }),
    
    Claim.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: '$claimAmount' } } }
    ]),
    
    Claim.aggregate([
      { 
        $match: { 
          user: userId, 
          status: { $in: [CLAIM_STATUS.APPROVED, CLAIM_STATUS.PAID] } 
        } 
      },
      { $group: { _id: null, total: { $sum: '$approvedAmount' } } }
    ]),
    
    Claim.find({ user: userId })
      .sort('-createdAt')
      .limit(5)
      .select('claimNumber claimType claimAmount status createdAt')
      .lean()
  ]);

  const stats = {
    overview: {
      total,
      submitted,
      underReview,
      approved,
      rejected,
      paid,
      closed
    },
    amounts: {
      totalClaimed: totalClaimed[0]?.total || 0,
      totalApproved: totalApproved[0]?.total || 0
    },
    recentClaims
  };

  return sendResponse(res, 200, true, 'Statistics retrieved successfully', stats);
});

/**
 * @desc    Get claims analytics
 * @route   GET /api/claims/analytics
 * @access  Private (Admin)
 */
exports.getClaimsAnalytics = asyncHandler(async (req, res) => {
  const { startDate, endDate, groupBy = 'month' } = req.query;

  const match = {};
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      match.createdAt.$lte = end;
    }
  }

  // Group by time period
  const dateGroupMap = {
    day: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, day: { $dayOfMonth: '$createdAt' } },
    week: { year: { $year: '$createdAt' }, week: { $week: '$createdAt' } },
    month: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
    year: { year: { $year: '$createdAt' } }
  };

  const dateGroup = dateGroupMap[groupBy] || dateGroupMap.month;

  const [claimsTrend, approvalStats, topClaimTypes, agentPerformance] = await Promise.all([
    // Claims trend
    Claim.aggregate([
      { $match: match },
      {
        $group: {
          _id: dateGroup,
          count: { $sum: 1 },
          totalClaimed: { $sum: '$claimAmount' },
          totalApproved: { $sum: '$approvedAmount' },
          avgClaimAmount: { $avg: '$claimAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]),
    
    // Approval rate
    Claim.aggregate([
      { $match: match },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    
    // Top claim types
    Claim.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$claimType',
          count: { $sum: 1 },
          totalAmount: { $sum: '$claimAmount' },
          avgAmount: { $avg: '$claimAmount' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]),
    
    // Agent performance
    req.user.role === 'admin' ? Claim.aggregate([
      { 
        $match: { 
          ...match, 
          assignedTo: { $exists: true, $ne: null } 
        } 
      },
      {
        $group: {
          _id: '$assignedTo',
          totalClaims: { $sum: 1 },
          approved: { $sum: { $cond: [{ $eq: ['$status', CLAIM_STATUS.APPROVED] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$status', CLAIM_STATUS.REJECTED] }, 1, 0] } },
          paid: { $sum: { $cond: [{ $eq: ['$status', CLAIM_STATUS.PAID] }, 1, 0] } }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'agent'
        }
      },
      { $unwind: '$agent' },
      {
        $project: {
          agentName: { $concat: ['$agent.firstName', ' ', '$agent.lastName'] },
          agentEmail: '$agent.email',
          totalClaims: 1,
          approved: 1,
          rejected: 1,
          paid: 1,
          approvalRate: {
            $cond: [
              { $gt: ['$totalClaims', 0] },
              { $multiply: [{ $divide: ['$approved', '$totalClaims'] }, 100] },
              0
            ]
          }
        }
      },
      { $sort: { totalClaims: -1 } }
    ]) : null
  ]);

  const analytics = {
    claimsTrend,
    approvalStats,
    topClaimTypes,
    agentPerformance
  };

  return sendResponse(res, 200, true, 'Analytics retrieved successfully', analytics);
});

/**
 * @desc    Export claims to CSV
 * @route   GET /api/claims/export
 * @access  Private (Admin, Agent)
 */
exports.exportClaims = asyncHandler(async (req, res) => {
  const { status, startDate, endDate } = req.query;
  
  const query = buildClaimsQuery(req.user);
  
  if (status) query.status = status;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt.$lte = end;
    }
  }

  const claims = await Claim.find(query)
    .populate('user', 'firstName lastName email phone')
    .populate('assignedTo', 'firstName lastName')
    .sort('-createdAt')
    .lean();

  // CSV headers
  const headers = [
    'Claim Number',
    'Policy Number',
    'Claimant Name',
    'Email',
    'Phone',
    'Claim Type',
    'Claim Amount',
    'Approved Amount',
    'Status',
    'Priority',
    'Assigned To',
    'Created Date',
    'Updated Date'
  ];

  const rows = claims.map(claim => {
    const claimantName = claim.user 
      ? `${claim.user.firstName} ${claim.user.lastName}`
      : 'N/A';
    const assignedTo = claim.assignedTo
      ? `${claim.assignedTo.firstName} ${claim.assignedTo.lastName}`
      : 'Unassigned';

    return [
      claim.claimNumber,
      claim.policyNumber,
      claimantName,
      claim.user?.email || 'N/A',
      claim.user?.phone || 'N/A',
      claim.claimType,
      claim.claimAmount,
      claim.approvedAmount || 0,
      claim.status,
      claim.priority,
      assignedTo,
      new Date(claim.createdAt).toLocaleDateString(),
      new Date(claim.updatedAt).toLocaleDateString()
    ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename=claims-export-${Date.now()}.csv`);
  res.status(200).send('\ufeff' + csv); // BOM for Excel compatibility
});

/**
 * @desc    Get pending review claims
 * @route   GET /api/claims/pending-review
 * @access  Private (Admin, Agent)
 */
exports.getPendingReview = asyncHandler(async (req, res) => {
  const query = buildClaimsQuery(req.user, { 
    status: CLAIM_STATUS.UNDER_REVIEW 
  });

  const claims = await Claim.find(query)
    .populate('user', 'firstName lastName email phone')
    .populate('assignedTo', 'firstName lastName email')
    .sort({ priority: -1, createdAt: 1 });

  return sendResponse(
    res,
    200,
    true,
    'Pending review claims retrieved successfully',
    claims,
    { count: claims.length }
  );
});

/**
 * @desc    Get claims by priority
 * @route   GET /api/claims/priority/:priority
 * @access  Private (Admin, Agent)
 */
exports.getClaimsByPriority = asyncHandler(async (req, res) => {
  const { priority } = req.params;
  
  if (!PRIORITY_LEVELS.includes(priority)) {
    return sendResponse(
      res,
      400,
      false,
      `Invalid priority. Must be one of: ${PRIORITY_LEVELS.join(', ')}`
    );
  }

  const query = buildClaimsQuery(req.user, { priority });

  const claims = await Claim.find(query)
    .populate('user', 'firstName lastName email phone')
    .populate('assignedTo', 'firstName lastName email')
    .sort({ createdAt: -1 });

  return sendResponse(
    res,
    200,
    true,
    `Claims with ${priority} priority retrieved successfully`,
    claims,
    { count: claims.length }
  );
});

module.exports = exports;
// ==========================================
/**
 * @desc    Get user's own claims
 * @route   GET /api/claims/my-claims
 * @access  Private (Client)
 */
exports.getMyClaims = asyncHandler(async (req, res) => {
  const { 
    status, 
    claimType, 
    sortBy = '-createdAt', 
    page = 1, 
    limit = 10,
    search
  } = req.query;

  const query = { user: req.user.id };

  if (status) query.status = status;
  if (claimType) query.claimType = claimType;
  if (search) {
    query.$or = [
      { claimNumber: { $regex: search, $options: 'i' } },
      { policyNumber: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [claims, total] = await Promise.all([
    Claim.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-notes -statusHistory')
      .lean(),
    Claim.countDocuments(query)
  ]);

  const sanitizedClaims = claims.map(sanitizeClaimForClient);

  return sendResponse(
    res,
    200,
    true,
    'Claims retrieved successfully',
    sanitizedClaims,
    buildPaginationMeta(total, page, limit)
  );
});

/**
 * @desc    Update claim
 * @route   PUT /api/claims/:id
 * @access  Private
 */
exports.updateClaim = asyncHandler(async (req, res) => {
  const claim = await Claim.findById(req.params.id);

  if (!claim) {
    return sendResponse(res, 404, false, 'Claim not found');
  }

  if (!hasClaimAccess(claim, req.user)) {
    return sendResponse(res, 403, false, 'Not authorized to update this claim');
  }

  // Role-based update restrictions
  if (req.user.role === 'client') {
    if (![CLAIM_STATUS.SUBMITTED, CLAIM_STATUS.DOCS_REQUIRED].includes(claim.status)) {
      return sendResponse(res, 400, false, `Cannot update claim in ${claim.status} status`);
    }

    // Only allow specific fields for clients
    const allowedUpdates = ['description', 'location', 'witnesses', 'paymentDetails'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return sendResponse(res, 400, false, 'No valid fields to update');
    }

    Object.assign(claim, updates);
    await claim.save();
  } else {
    // Agents and admins can update more fields
    const restrictedFields = ['claimNumber', 'user', 'createdAt', '__v'];
    const updates = { ...req.body };
    
    restrictedFields.forEach(field => delete updates[field]);
    
    Object.assign(claim, updates);
    await claim.save();
    
    await claim.populate([
      { path: 'user', select: 'firstName lastName email phone' },
      { path: 'assignedTo', select: 'firstName lastName email' }
    ]);
  }

  return sendResponse(res, 200, true, 'Claim updated successfully', claim);
});

/**
 * @desc    Cancel claim
 * @route   PUT /api/claims/:id/cancel
 * @access  Private (Client)
 */
exports.cancelClaim = asyncHandler(async (req, res) => {
  const claim = await Claim.findById(req.params.id);

  if (!claim) {
    return sendResponse(res, 404, false, 'Claim not found');
  }

  if (claim.user.toString() !== req.user.id) {
    return sendResponse(res, 403, false, 'Not authorized to cancel this claim');
  }

  if (claim.status !== CLAIM_STATUS.SUBMITTED) {
    return sendResponse(res, 400, false, 'Can only cancel claims in Submitted status');
  }

  const { reason } = req.body;

  claim.status = CLAIM_STATUS.CLOSED;
  claim.statusHistory.push({
    status: CLAIM_STATUS.CLOSED,
    changedBy: req.user.id,
    changedAt: new Date(),
    comment: `Cancelled by claimant${reason ? `: ${reason}` : ''}`
  });

  await claim.save();

  // Notify assigned agent if any
  if (claim.assignedTo) {
    const agent = await User.findById(claim.assignedTo);
    if (agent) {
      await sendNotification('CLAIM_CANCELLED', agent, claim);
    }
  }

  return sendResponse(res, 200, true, 'Claim cancelled successfully', claim);
});

// ==========================================
// AGENT OPERATIONS
// ==========================================

/**
 * @desc    Get assigned claims
 * @route   GET /api/claims/assigned
 * @access  Private (Agent)
 */
exports.getAssignedClaims = asyncHandler(async (req, res) => {
  const { 
    status, 
    priority, 
    sortBy = '-createdAt', 
    page = 1, 
    limit = 10 
  } = req.query;

  const query = { assignedTo: req.user.id };

  if (status) query.status = status;
  if (priority) query.priority = priority;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [claims, total] = await Promise.all([
    Claim.find(query)
      .populate('user', 'firstName lastName email phone')
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit)),
    Claim.countDocuments(query)
  ]);

  return sendResponse(
    res,
    200,
    true,
    'Assigned claims retrieved successfully',
    claims,
    buildPaginationMeta(total, page, limit)
  );
});

/**
 * @desc    Assign claim
 * @route   PUT /api/claims/:id/assign
 * @access  Private (Agent, Admin)
 */
exports.assignClaim = asyncHandler(async (req, res) => {
  const { agentId } = req.body;
  const claim = await Claim.findById(req.params.id);

  if (!claim) {
    return sendResponse(res, 404, false, 'Claim not found');
  }

  // Role-based assignment rules
  if (req.user.role === 'agent' && agentId && agentId !== req.user.id) {
    return sendResponse(res, 403, false, 'Agents can only assign claims to themselves');
  }

  const targetAgentId = agentId || req.user.id;

  // Verify agent exists and is active
  const agent = await User.findById(targetAgentId);
  if (!agent || !['agent', 'admin'].includes(agent.role)) {
    return sendResponse(res, 400, false, 'Invalid agent ID');
  }

  if (!agent.isActive) {
    return sendResponse(res, 400, false, 'Cannot assign to inactive agent');
  }

  claim.assignedTo = targetAgentId;
  
  if (claim.status === CLAIM_STATUS.SUBMITTED) {
    claim.status = CLAIM_STATUS.UNDER_REVIEW;
  }

  claim.statusHistory.push({
    status: claim.status,
    changedBy: req.user.id,
    changedAt: new Date(),
    comment: `Assigned to ${agent.firstName} ${agent.lastName}`
  });

  await claim.save();
  await claim.populate([
    { path: 'user', select: 'firstName lastName email phone' },
    { path: 'assignedTo', select: 'firstName lastName email' }
  ]);

  // Notify agent
  await sendNotification('CLAIM_ASSIGNED', agent, claim);

  return sendResponse(res, 200, true, 'Claim assigned successfully', claim);
});

/**
 * @desc    Add internal note
 * @route   POST /api/claims/:id/notes
 * @access  Private (Agent, Admin)
 */
exports.addNote = asyncHandler(async (req, res) => {
  const { note } = req.body;
  
  if (!note || note.trim().length === 0) {
    return sendResponse(res, 400, false, 'Note content is required');
  }

  const claim = await Claim.findById(req.params.id);

  if (!claim) {
    return sendResponse(res, 404, false, 'Claim not found');
  }

  // Agents can only add notes to assigned claims
  if (req.user.role === 'agent' && claim.assignedTo?.toString() !== req.user.id) {
    return sendResponse(res, 403, false, 'Not authorized to add notes to this claim');
  }

  claim.notes.push({
    addedBy: req.user.id,
    note: note.trim(),
    addedAt: new Date()
  });

  await claim.save();
  await claim.populate('notes.addedBy', 'firstName lastName email role');

  return sendResponse(res, 200, true, 'Note added successfully', { notes: claim.notes });
});

/**
 * @desc    Request additional documents
 * @route   PUT /api/claims/:id/request-documents
 * @access  Private (Agent, Admin)
 */
exports.requestDocuments = asyncHandler(async (req, res) => {
  const { requiredDocuments, message } = req.body;
  
  if (!requiredDocuments || !Array.isArray(requiredDocuments) || requiredDocuments.length === 0) {
    return sendResponse(res, 400, false, 'Required documents list cannot be empty');
  }

  const claim = await Claim.findById(req.params.id);

  if (!claim) {
    return sendResponse(res, 404, false, 'Claim not found');
  }

  if (req.user.role === 'agent' && claim.assignedTo?.toString() !== req.user.id) {
    return sendResponse(res, 403, false, 'Not authorized to modify this claim');
  }

  claim.status = CLAIM_STATUS.DOCS_REQUIRED;
  
  const docList = requiredDocuments.join(', ');
  const noteText = `Additional documents requested: ${docList}${message ? `. ${message}` : ''}`;
  
  claim.notes.push({
    addedBy: req.user.id,
    note: noteText,
    addedAt: new Date()
  });

  claim.statusHistory.push({
    status: CLAIM_STATUS.DOCS_REQUIRED,
    changedBy: req.user.id,
    changedAt: new Date(),
    comment: message || 'Additional documents required'
  });

  await claim.save();
  await claim.populate([
    { path: 'user', select: 'firstName lastName email phone' },
    { path: 'assignedTo', select: 'firstName lastName email' }
  ]);

  // Notify claimant
  const claimant = await User.findById(claim.user._id || claim.user);
  if (claimant) {
    await sendNotification('DOCUMENTS_REQUIRED', claimant, claim, { 
      requiredDocuments,
      message 
    });
  }

  return sendResponse(res, 200, true, 'Document request sent to claimant', claim);
});

/**
 * @desc    Update claim priority
 * @route   PUT /api/claims/:id/priority
 * @access  Private (Agent, Admin)
 */
exports.updatePriority = asyncHandler(async (req, res) => {
  const { priority } = req.body;
  
  if (!PRIORITY_LEVELS.includes(priority)) {
    return sendResponse(
      res, 
      400, 
      false, 
      `Invalid priority. Must be one of: ${PRIORITY_LEVELS.join(', ')}`
    );
  }

  const claim = await Claim.findById(req.params.id);

  if (!claim) {
    return sendResponse(res, 404, false, 'Claim not found');
  }

  if (req.user.role === 'agent' && claim.assignedTo?.toString() !== req.user.id) {
    return sendResponse(res, 403, false, 'Not authorized to modify this claim');
  }

  const oldPriority = claim.priority;
  claim.priority = priority;
  
  claim.notes.push({
    addedBy: req.user.id,
    note: `Priority changed from ${oldPriority} to ${priority}`,
    addedAt: new Date()
  });

  await claim.save();

  return sendResponse(res, 200, true, 'Priority updated successfully', { 
    priority: claim.priority 
  });
});

// ==========================================
// ADMIN OPERATIONS
// ==========================================

/**
 * @desc    Get all claims with advanced filtering
 * @route   GET /api/claims
 * @access  Private (Admin, Agent)
 */
exports.getAllClaims = asyncHandler(async (req, res) => {
  const { 
    status, 
    claimType, 
    policyType,
    priority, 
    assignedTo,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    search,
    sortBy = '-createdAt', 
    page = 1, 
    limit = 20 
  } = req.query;

  const query = buildClaimsQuery(req.user);

  // Apply filters
  if (status) query.status = status;
  if (claimType) query.claimType = claimType;
  if (policyType) query.policyType = policyType;
  if (priority) query.priority = priority;
  if (assignedTo) query.assignedTo = assignedTo;

  // Date range
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt.$lte = end;
    }
  }

  // Amount range
  if (minAmount || maxAmount) {
    query.claimAmount = {};
    if (minAmount) query.claimAmount.$gte = parseFloat(minAmount);
    if (maxAmount) query.claimAmount.$lte = parseFloat(maxAmount);
  }

  // Search
  if (search) {
    query.$or = [
      { claimNumber: { $regex: search, $options: 'i' } },
      { policyNumber: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [claims, total] = await Promise.all([
    Claim.find(query)
      .populate('user', 'firstName lastName email phone')
      .populate('assignedTo', 'firstName lastName email')
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Claim.countDocuments(query)
  ]);

  return sendResponse(
    res,
    200,
    true,
    'Claims retrieved successfully',
    claims,
    buildPaginationMeta(total, page, limit)
  );
});

/**
 * @desc    Approve claim
 * @route   PUT /api/claims/:id/approve
 * @access  Private (Admin)
 */
exports.approveClaim = asyncHandler(async (req, res) => {
  const { approvedAmount, comment } = req.body;
  
  if (!approvedAmount || approvedAmount <= 0) {
    return sendResponse(res, 400, false, 'Approved amount must be greater than zero');
  }

  const claim = await Claim.findById(req.params.id);

  if (!claim) {
    return sendResponse(res, 404, false, 'Claim not found');
  }

  if (![CLAIM_STATUS.UNDER_REVIEW, CLAIM_STATUS.SUBMITTED].includes(claim.status)) {
    return sendResponse(res, 400, false, `Cannot approve claim in ${claim.status} status`);
  }

  const parsedAmount = parseFloat(approvedAmount);
  
  if (parsedAmount > claim.claimAmount) {
    return sendResponse(res, 400, false, 'Approved amount cannot exceed claimed amount');
  }

  claim.status = CLAIM_STATUS.APPROVED;
  claim.approvedAmount = parsedAmount;
  
  claim.statusHistory.push({
    status: CLAIM_STATUS.APPROVED,
    changedBy: req.user.id,
    changedAt: new Date(),
    comment: comment || `Approved for ${parsedAmount}`
  });

  if (comment) {
    claim.notes.push({
      addedBy: req.user.id,
      note: comment,
      addedAt: new Date()
    });
  }

  await claim.save();
  await claim.populate([
    { path: 'user', select: 'firstName lastName email' },
    { path: 'assignedTo', select: 'firstName lastName email' }
  ]);
  // Notify claimant
  const claimant = await User.findById(claim.user._id || claim.user); 
  if (claimant) {
    await sendNotification('CLAIM_APPROVED', claimant, claim);
  }

  return sendResponse(res, 200, true, 'Claim approved successfully', claim);
});


 //his is the CORRECTED approveClaim function and the sections that follow it
// Replace from line ~850 onwards in your controller

/**
 * @desc    Approve claim
 * @route   PUT /api/claims/:id/approve
 * @access  Private (Admin)
 */
exports.approveClaim = asyncHandler(async (req, res) => {
  const { approvedAmount, comment } = req.body;
  
  if (!approvedAmount || approvedAmount <= 0) {
    return sendResponse(res, 400, false, 'Approved amount must be greater than zero');
  }

  const claim = await Claim.findById(req.params.id);

  if (!claim) {
    return sendResponse(res, 404, false, 'Claim not found');
  }

  if (![CLAIM_STATUS.UNDER_REVIEW, CLAIM_STATUS.SUBMITTED].includes(claim.status)) {
    return sendResponse(res, 400, false, `Cannot approve claim in ${claim.status} status`);
  }

  const parsedAmount = parseFloat(approvedAmount);
  
  if (parsedAmount > claim.claimAmount) {
    return sendResponse(res, 400, false, 'Approved amount cannot exceed claimed amount');
  }

  claim.status = CLAIM_STATUS.APPROVED;
  claim.approvedAmount = parsedAmount;
  
  claim.statusHistory.push({
    status: CLAIM_STATUS.APPROVED,
    changedBy: req.user.id,
    changedAt: new Date(),
    comment: comment || `Approved for ${parsedAmount}`
  });

  if (comment) {
    claim.notes.push({
      addedBy: req.user.id,
      note: comment,
      addedAt: new Date()
    });
  }

  await claim.save();
  await claim.populate([
    { path: 'user', select: 'firstName lastName email phone' },
    { path: 'assignedTo', select: 'firstName lastName email' }
  ]);

  // Notify claimant
  const claimant = await User.findById(claim.user._id || claim.user);
  if (claimant) {
    await sendNotification('CLAIM_APPROVED', claimant, claim, { approvedAmount: parsedAmount });
  }

  return sendResponse(res, 200, true, 'Claim approved successfully', claim);
});

// The rest of the controller continues here...
// Make sure there are no duplicate functions or missing closing braces