const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    complaintNumber: { 
      type: String, 
      unique: true,
      index: true
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Claims", "Billing", "Documentation", "Technical", "Customer Service", "Other"],
    },
    policyNumber: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    response: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Pre-save hook to auto-generate complaint number
complaintSchema.pre("save", async function (next) {
  // Only generate complaint number for new documents
  if (!this.isNew || this.complaintNumber) {
    return next();
  }

  try {
    // Find the last complaint and extract the number
    const lastComplaint = await mongoose
      .model("Complaint")
      .findOne({}, { complaintNumber: 1 })
      .sort({ createdAt: -1 })
      .lean();

    let nextNumber = 1;

    if (lastComplaint && lastComplaint.complaintNumber) {
      // Extract number from format like "CMP-00001"
      const match = lastComplaint.complaintNumber.match(/CMP-(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    // Format with leading zeros (e.g., CMP-00001, CMP-00023, CMP-01234)
    this.complaintNumber = `CMP-${nextNumber.toString().padStart(5, "0")}`;
    next();
  } catch (error) {
    next(error);
  }
});

// Alternative: Create a compound index for better query performance
complaintSchema.index({ user: 1, createdAt: -1 });
complaintSchema.index({ status: 1, priority: 1 });

// Instance method to get complaint age in days
complaintSchema.methods.getAgeInDays = function () {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Static method to get complaints by status
complaintSchema.statics.getByStatus = function (status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Static method to get user's complaint statistics
complaintSchema.statics.getUserStats = async function (userId) {
  const stats = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  return stats.reduce((acc, stat) => {
    acc[stat._id.toLowerCase().replace(" ", "_")] = stat.count;
    return acc;
  }, {});
};

module.exports = mongoose.models.Complaint || mongoose.model("Complaint", complaintSchema);