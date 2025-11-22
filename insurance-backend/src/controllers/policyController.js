const Policy = require('../models/Policy');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Create a new policy
 * @route   POST /api/policies
 * @access  Admin
 */
exports.createPolicy = asyncHandler(async (req, res) => {
  const { holder, type, premium, coverage, paymentFrequency, startDate, endDate, beneficiary, notes } = req.body;

  const policy = await Policy.create({
    holder,
    type,
    premium,
    coverage,
    paymentFrequency,
    startDate,
    endDate,
    beneficiary,
    notes,
  });

  res.status(201).json({
    success: true,
    message: 'Policy created successfully',
    data: policy,
  });
});

/**
 * @desc    Create a demo policy (for testing)
 * @route   POST /api/policies/demo
 * @access  Admin or Agent
 */
exports.createDemoPolicy = asyncHandler(async (req, res) => {
  const policy = await Policy.create({
    holder: req.user.id,
    type: 'Health Insurance',
    premium: 1200,
    coverage: 50000,
    paymentFrequency: 'Monthly',
    startDate: new Date(),
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    beneficiary: {
      name: 'John Doe',
      relationship: 'Spouse',
      phone: '+250788123456',
    },
    notes: 'Demo policy for testing purposes',
    status: 'Active',
  });

  res.status(201).json({
    success: true,
    message: 'Demo policy created successfully',
    data: policy,
  });
});

/**
 * @desc    Get all policies
 * @route   GET /api/policies
 * @access  Admin, Agent
 */
exports.getAllPolicies = asyncHandler(async (req, res) => {
  const policies = await Policy.find().populate('holder', 'name email role');
  res.status(200).json({
    success: true,
    count: policies.length,
    data: policies,
  });
});

/**
 * @desc    Get policies for the authenticated user
 * @route   GET /api/policies/my-policies
 * @access  Private (Client)
 */
exports.getMyPolicies = asyncHandler(async (req, res) => {
  const policies = await Policy.find({ holder: req.user.id });
  res.status(200).json({
    success: true,
    count: policies.length,
    data: policies,
  });
});

/**
 * @desc    Get single policy by ID
 * @route   GET /api/policies/:id
 * @access  Admin, Agent, or the policy holder
 */
exports.getPolicy = asyncHandler(async (req, res) => {
  const policy = await Policy.findById(req.params.id).populate('holder', 'name email role');
  if (!policy) {
    res.status(404);
    throw new Error('Policy not found');
  }

  // Only the policy owner or admin/agent can access
  if (req.user.role !== 'admin' && req.user.role !== 'agent' && policy.holder._id.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to view this policy');
  }

  res.status(200).json({ success: true, data: policy });
});

/**
 * @desc    Update a policy
 * @route   PUT /api/policies/:id
 * @access  Admin
 */
exports.updatePolicy = asyncHandler(async (req, res) => {
  const policy = await Policy.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!policy) {
    res.status(404);
    throw new Error('Policy not found');
  }

  res.status(200).json({
    success: true,
    message: 'Policy updated successfully',
    data: policy,
  });
});

/**
 * @desc    Update policy status
 * @route   PUT /api/policies/:id/status
 * @access  Admin
 */
exports.updatePolicyStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const policy = await Policy.findById(req.params.id);

  if (!policy) {
    res.status(404);
    throw new Error('Policy not found');
  }

  policy.status = status;
  await policy.save();

  res.status(200).json({
    success: true,
    message: 'Policy status updated successfully',
    data: policy,
  });
});

/**
 * @desc    Delete a policy
 * @route   DELETE /api/policies/:id
 * @access  Admin
 */
exports.deletePolicy = asyncHandler(async (req, res) => {
  const policy = await Policy.findById(req.params.id);

  if (!policy) {
    res.status(404);
    throw new Error('Policy not found');
  }

  await policy.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Policy deleted successfully',
  });
});

/**
 * @desc    Get policy statistics
 * @route   GET /api/policies/stats
 * @access  Admin
 */
exports.getPolicyStats = asyncHandler(async (req, res) => {
  const total = await Policy.countDocuments();
  const active = await Policy.countDocuments({ status: 'Active' });
  const pending = await Policy.countDocuments({ status: 'Pending' });
  const expired = await Policy.countDocuments({ status: 'Expired' });

  res.status(200).json({
    success: true,
    data: {
      total,
      active,
      pending,
      expired,
    },
  });
});
