const express = require('express');
const {
  // Client Operations
  submitClaim,
  uploadDocuments,
  getMyClaims,
  updateClaim,
  cancelClaim,
  getMyClaimStats,
  
  // Agent Operations
  getAssignedClaims,
  assignClaim,
  addNote,
  requestDocuments,
  updatePriority,
  
  // Admin Operations
  getAllClaims,
  approveClaim,
  rejectClaim,
  markAsPaid,
  deleteClaim,
  reopenClaim,
  bulkAssignClaims,
  
  // Shared Operations
  getClaim,
  getClaimStats,
  getClaimsAnalytics,
  exportClaims,
  getPendingReview,
  getClaimsByPriority
} = require('../controllers/claimController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// ==========================================
// PUBLIC ROUTES (None - All require authentication)
// ==========================================

// All routes require authentication
router.use(protect);

// ==========================================
// CLIENT ROUTES
// ==========================================

// Get user's own claims
router.get('/my-claims', getMyClaims);

// Get user's claim statistics
router.get('/my-stats', getMyClaimStats);

// Submit new claim
router.post('/', submitClaim);

// Cancel own claim
router.put('/:id/cancel', cancelClaim);

// Upload documents to claim
router.post('/:id/documents', uploadDocuments);

// ==========================================
// AGENT ROUTES
// ==========================================

// Get assigned claims
router.get('/assigned', authorize('agent', 'admin'), getAssignedClaims);

// Assign claim to agent
router.put('/:id/assign', authorize('agent', 'admin'), assignClaim);

// Add internal note to claim
router.post('/:id/notes', authorize('agent', 'admin'), addNote);

// Request additional documents
router.put('/:id/request-documents', authorize('agent', 'admin'), requestDocuments);

// Update claim priority
router.put('/:id/priority', authorize('agent', 'admin'), updatePriority);

// Get pending review claims
router.get('/pending-review', authorize('agent', 'admin'), getPendingReview);

// Get claims by priority
router.get('/priority/:priority', authorize('agent', 'admin'), getClaimsByPriority);

// ==========================================
// ADMIN ROUTES
// ==========================================

// Get all claims with filters
router.get('/', authorize('admin', 'agent'), getAllClaims);

// Get claim statistics
router.get('/stats', authorize('admin', 'agent'), getClaimStats);

// Get claims analytics
router.get('/analytics', authorize('admin'), getClaimsAnalytics);

// Export claims to CSV
router.get('/export', authorize('admin', 'agent'), exportClaims);

// Approve claim
router.put('/:id/approve', authorize('admin'), approveClaim);

// Reject claim
router.put('/:id/reject', authorize('admin'), rejectClaim);

// Mark claim as paid
router.put('/:id/mark-paid', authorize('admin'), markAsPaid);

// Reopen closed claim
router.put('/:id/reopen', authorize('admin'), reopenClaim);

// Bulk assign claims
router.post('/bulk-assign', authorize('admin'), bulkAssignClaims);

// Delete claim
router.delete('/:id', authorize('admin'), deleteClaim);

// ==========================================
// SHARED ROUTES (All authenticated users)
// ==========================================

// Get single claim details
router.get('/:id', getClaim);

// Update claim
router.put('/:id', updateClaim);

// ==========================================
// ROUTE ORDERING NOTE
// ==========================================
/*
  Routes are ordered to prevent conflicts:
  1. Specific paths come first (e.g., /my-claims, /assigned, /stats)
  2. Dynamic paths come last (e.g., /:id)
  3. This prevents /:id from matching routes like /my-claims
*/

module.exports = router;