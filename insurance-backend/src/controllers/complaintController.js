const Complaint = require("../models/Complaint");
const asyncHandler = require("express-async-handler");

// Helper to generate unique complaint ID
const generateComplaintId = async () => {
  const count = await Complaint.countDocuments();
  const year = new Date().getFullYear();
  return `CMP-${year}-${String(count + 1).padStart(3, '0')}`;
};

// ✅ Create new complaint (Client)
exports.createComplaint = asyncHandler(async (req, res) => {
  const { subject, category, policyNumber, description, priority } = req.body;
  if (!subject || !category || !policyNumber || !description) {
    return res.status(400).json({ success: false, message: "All required fields must be filled" });
  }

  const complaintId = await generateComplaintId();

  const complaint = await Complaint.create({
    user: req.user._id,
    id: complaintId,
    subject,
    category,
    policyNumber,
    description,
    priority,
    status: "Open"
  });

  res.status(201).json({ success: true, complaint });
});

// ✅ Get complaints for logged-in client
exports.getMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, complaints });
});

// ✅ Get all complaints (Admin)
exports.getAllComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find()
    .populate("user", "firstName lastName email")
    .sort({ createdAt: -1 });
  res.json({ success: true, complaints });
});

// ✅ Get single complaint (Admin or Owner)
exports.getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id).populate("user", "firstName lastName email");
  if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });

  if (req.user.role !== "admin" && complaint.user._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  res.json({ success: true, complaint });
});

// ✅ Update complaint (Admin)
exports.updateComplaint = asyncHandler(async (req, res) => {
  const { status, response } = req.body;
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });

  complaint.status = status || complaint.status;
  complaint.response = response || complaint.response;
  await complaint.save();

  res.json({ success: true, message: "Complaint updated", complaint });
});

// ✅ Delete complaint (Admin)
exports.deleteComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findByIdAndDelete(req.params.id);
  if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });

  res.json({ success: true, message: "Complaint deleted successfully" });
});
