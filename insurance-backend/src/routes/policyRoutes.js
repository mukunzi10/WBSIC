const express = require('express');
const Policy = require('../models/Policy'); // import the model
const {
  getAllPolicies,
  getMyPolicies,
  getPolicy,
  createPolicy,
  updatePolicy,
  deletePolicy,
  updatePolicyStatus,
  getPolicyStats,
  createDemoPolicy
} = require('../controllers/policyController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Routes
router.use(protect);

router.get('/my-policies', getMyPolicies);
router.post('/demo', authorize('admin', 'agent'), createDemoPolicy);
router.get('/stats', authorize('admin'), getPolicyStats);
router.get('/', authorize('admin', 'agent'), getAllPolicies);
router.post('/', authorize('admin'), createPolicy);

router.route('/:id')
  .get(getPolicy)
  .put(authorize('admin'), updatePolicy)
  .delete(authorize('admin'), deletePolicy);

router.put('/:id/status', authorize('admin'), updatePolicyStatus);

module.exports = router;
