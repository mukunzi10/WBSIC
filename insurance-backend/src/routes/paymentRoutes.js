// ==================== PAYMENT ROUTES ====================

const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

// Record payment
router.post('/', authorize('admin'), async (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Payment recorded successfully'
  });
});

// Get payment history
router.get('/my-payments', async (req, res) => {
  res.status(200).json({
    success: true,
    data: []
  });
});

// Get all payments (Admin)
router.get('/', authorize('admin'), async (req, res) => {
  res.status(200).json({
    success: true,
    data: []
  });
});

module.exports = router;