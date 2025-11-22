const mongoose = require("mongoose");

const serviceApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    fullName: {
      type: String,
      required: [true, "Please provide your full name"],
      trim: true
    },
    phone: {
      type: String,
      required: [true, "Please provide your phone number"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email"
      ]
    },
    message: {
      type: String,
      maxlength: [500, "Message cannot exceed 500 characters"]
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'approved', 'rejected', 'completed'],
      default: 'pending'
    },
    adminNotes: {
      type: String,
      maxlength: [1000, "Admin notes cannot exceed 1000 characters"]
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Add indexes for faster queries
serviceApplicationSchema.index({ user: 1, createdAt: -1 });
serviceApplicationSchema.index({ service: 1, status: 1 });
serviceApplicationSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("ServiceApplication", serviceApplicationSchema);