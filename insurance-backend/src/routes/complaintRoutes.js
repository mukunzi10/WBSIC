const express = require("express");
const router = express.Router();
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint
} = require("../controllers/complaintController");

const { protect, adminOnly } = require("../middleware/auth");

// Client routes
router.post("/addComplaints", protect, createComplaint);
router.get("/my-complaints", protect, getMyComplaints);
router.get("/:id", protect, getComplaintById);

// Admin routes
router.get("/", protect, adminOnly, getAllComplaints);
router.put("/:id", protect, adminOnly, updateComplaint);
router.delete("/:id", protect, adminOnly, deleteComplaint);

module.exports = router;
