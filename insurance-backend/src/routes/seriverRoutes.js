const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  hello,
  // Service Management
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService,
  
  // Service Applications
  submitApplication,
  getMyApplications,
  getAllApplications,
  getApplication,
  assignApplication,
  addNote,
  approveApplication,
  rejectApplication,
  convertToPolicy,
  getApplicationStats
} = require('../controllers/serviceController');

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Test route
router.get('/hello', hello);

// Get all services (public - anyone can browse)
router.get('/', getAllServices);

// Get single service (public)
router.get('/:id', getService);

// ==========================================
// SERVICE MANAGEMENT ROUTES (Admin Only)
// ==========================================

// Create service
router.post(
  '/admin/services',
  protect,
  authorize('admin'),
  createService
);

// Update service
router.put(
  '/admin/services/:id',
  protect,
  authorize('admin'),
  updateService
);

// Delete service
router.delete(
  '/admin/services/:id',
  protect,
  authorize('admin'),
  deleteService
);

// ==========================================
// APPLICATION ROUTES
// ==========================================

// Submit application (authenticated users)
router.post(
  '/applications',
  protect,
  authorize('policyholder', 'agent', 'admin'),
  submitApplication
);

// Get my applications (client view)
router.get(
  '/applications/my-applications',
  protect,
  authorize('policyholder', 'agent', 'admin'),
  getMyApplications
);

// Get application statistics (admin, agent)
router.get(
  '/applications/stats',
  protect,
  authorize('agent', 'admin'),
  getApplicationStats
);

// Get all applications (admin, agent)
router.get(
  '/applications',
  protect,
  authorize('agent', 'admin'),
  getAllApplications
);

// Get single application
router.get(
  '/applications/:id',
  protect,
  authorize('policyholder', 'agent', 'admin'),
  getApplication
);

// Assign application (admin, agent)
router.put(
  '/applications/:id/assign',
  protect,
  authorize('agent', 'admin'),
  assignApplication
);

// Add note to application (admin, agent)
router.post(
  '/applications/:id/notes',
  protect,
  authorize('agent', 'admin'),
  addNote
);

// Approve application (admin only)
router.put(
  '/applications/:id/approve',
  protect,
  authorize('admin'),
  approveApplication
);

// Reject application (admin only)
router.put(
  '/applications/:id/reject',
  protect,
  authorize('admin'),
  rejectApplication
);

// Convert application to policy (admin only)
router.put(
  '/applications/:id/convert',
  protect,
  authorize('admin'),
  convertToPolicy
);

module.exports = router;