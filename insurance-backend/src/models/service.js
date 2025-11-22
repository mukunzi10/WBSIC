const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide service name"],
      trim: true,
      maxlength: [100, "Service name cannot exceed 100 characters"]
    },
    description: {
      type: String,
      required: [true, "Please provide service description"],
      maxlength: [1000, "Description cannot exceed 1000 characters"]
    },
    category: {
      type: String,
      required: [true, "Please provide service category"],
      enum: [
        'life',
        'health',
        'motor',
        'property',
        'travel',
        'business',
        'group',
        'savings',
        'investment'
      ]
    },
    premium: {
      type: String,
      required: [true, "Please provide premium amount"],
      trim: true
    },
    features: {
      type: [String],
      default: []
    },
    benefits: {
      type: [String],
      default: []
    },
    coverage: {
      type: String,
      default: ''
    },
    exclusions: {
      type: [String],
      default: []
    },
    requirements: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived'],
      default: 'active'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Add index for faster queries
serviceSchema.index({ category: 1, status: 1 });
serviceSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model("Service", serviceSchema);