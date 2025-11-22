const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');

const upload = multer({ dest: 'temp/' });

// All routes require authentication
router.use(protect);

// Client routes
router.post('/claims', authorize('client'), claimController.submitClaim);
router.get('/claims/my-claims', authorize('client'), claimController.getMyClaims);

// Upload claim documents
router.post(
  '/claims/:id/documents',
  upload.array('files'),      // <-- multer middleware
  claimController.uploadDocuments
);

// Update, cancel claim
router.put('/claims/:id', claimController.updateClaim);
router.put('/claims/:id/cancel', claimController.cancelClaim);

// Agent/Admin routes
router.get('/claims/assigned', authorize('agent'), claimController.getAssignedClaims);
router.put('/claims/:id/assign', authorize('agent', 'admin'), claimController.assignClaim);

// Export router
module.exports = router;
