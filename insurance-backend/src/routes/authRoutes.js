const express = require('express');

const router = express.Router();
const {
  register,
  login,
  verifyToken,
  getMe,
  updateDetails,
  updatePassword,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Token verification (semi-public)
router.get('/verify', verifyToken);

// Protected routes
router.get("/me", protect, async (req, res) => {
  try {
    // ✅ `req.user` is already populated by the middleware
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user data",
    });
  }
});
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/logout', protect, logout);

module.exports = router;
