// const mongoose = require("mongoose");

// const claimSchema = new mongoose.Schema(
//   {
//     claimNumber: { type: String, unique: true, index: true },
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     policyNumber: { type: String, required: true, index: true },
//     policyType: {
//       type: String,
//       required: true,
//       enum: ["Life", "Health", "Auto", "Home", "Property", "Travel", "Other"],
//     },
//     claimType: {
//       type: String,
//       required: true,
//       enum: [
//         "Death Benefit",
//         "Medical Expense",
//         "Accident",
//         "Property Damage",
//         "Theft",
//         "Natural Disaster",
//         "Hospitalization",
//         "Surgery",
//         "Disability",
//         "Other",
//       ],
//     },
//     incidentDate: { type: Date, required: true },
//     claimAmount: { type: Number, required: true, min: 0 },
//     approvedAmount: { type: Number, default: 0, min: 0 },
//     description: { type: String, required: true, trim: true },
//     location: { type: String, trim: true },
//     witnesses: { type: [{ name: String, contact: String }], default: [] },
//     documents: {
//       type: [
//         {
//           documentType: {
//             type: String,
//             enum: [
//               "Police Report",
//               "Medical Report",
//               "Invoice",
//               "Receipt",
//               "Photo",
//               "Video",
//               "Death Certificate",
//               "Hospital Records",
//               "Other",
//             ],
//           },
//           fileName: String,
//           fileUrl: String,
//           uploadedAt: { type: Date, default: Date.now },
//         },
//       ],
//       default: [],
//     },
//     status: {
//       type: String,
//       enum: [
//         "Submitted",
//         "Under Review",
//         "Documents Required",
//         "Approved",
//         "Rejected",
//         "Processing Payment",
//         "Paid",
//         "Closed",
//       ],
//       default: "Submitted",
//     },
//     priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
//     assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     rejectionReason: { type: String, trim: true },
//     notes: {
//       type: [
//         {
//           addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//           note: String,
//           addedAt: { type: Date, default: Date.now },
//         },
//       ],
//       default: [],
//     },
//     paymentDetails: {
//       method: { type: String, enum: ["Bank Transfer", "Check", "Mobile Money", "Cash", "Other"] },
//       accountNumber: String,
//       accountName: String,
//       transactionId: String,
//       paidAt: Date,
//     },
//     statusHistory: {
//       type: [
//         {
//           status: String,
//           changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//           changedAt: { type: Date, default: Date.now },
//           comment: String,
//         },
//       ],
//       default: [],
//     },
//   },
//   { timestamps: true }
// );

// // Auto-generate claim number
// claimSchema.pre("save", async function (next) {
//   if (!this.isNew || this.claimNumber) return next();

//   const lastClaim = await mongoose.model("Claim").findOne({}, { claimNumber: 1 }).sort({ createdAt: -1 }).lean();
//   let nextNumber = 1;

//   if (lastClaim?.claimNumber) {
//     const match = lastClaim.claimNumber.match(/CLM-(\d+)/);
//     if (match) nextNumber = parseInt(match[1], 10) + 1;
//   }

//   this.claimNumber = `CLM-${nextNumber.toString().padStart(6, "0")}`;
//   next();
// });

// // Track status changes
// claimSchema.pre("save", function (next) {
//   if (this.isModified("status") && !this.isNew) {
//     this.statusHistory.push({
//       status: this.status,
//       changedBy: this.assignedTo || null,
//       changedAt: new Date(),
//     });
//   }
//   next();
// });

// // Indexes
// claimSchema.index({ user: 1, createdAt: -1 });
// claimSchema.index({ status: 1, priority: 1 });
// claimSchema.index({ assignedTo: 1, status: 1, priority: 1 });
// claimSchema.index({ policyNumber: 1 });
// claimSchema.index({ incidentDate: -1 });

// // Virtuals
// claimSchema.virtual("ageInDays").get(function () {
//   return Math.ceil((Date.now() - new Date(this.createdAt)) / (1000 * 60 * 60 * 24));
// });
// claimSchema.virtual("processingDays").get(function () {
//   if (["Paid", "Closed", "Rejected"].includes(this.status)) {
//     return Math.ceil((new Date(this.updatedAt) - new Date(this.createdAt)) / (1000 * 60 * 60 * 24));
//   }
//   return null;
// });

// // Methods
// claimSchema.methods.addNote = function (userId, noteText) {
//   this.notes.push({ addedBy: userId, note: noteText, addedAt: new Date() });
//   return this.save();
// };

// claimSchema.methods.approveClaim = function (approvedAmount, userId) {
//   this.status = "Approved";
//   this.approvedAmount = approvedAmount;
//   this.statusHistory.push({
//     status: "Approved",
//     changedBy: userId || null,
//     changedAt: new Date(),
//     comment: `Claim approved for amount: ${approvedAmount}`,
//   });
//   return this.save();
// };

// claimSchema.methods.rejectClaim = function (reason, userId) {
//   this.status = "Rejected";
//   this.rejectionReason = reason;
//   this.statusHistory.push({
//     status: "Rejected",
//     changedBy: userId || null,
//     changedAt: new Date(),
//     comment: reason || "No reason provided",
//   });
//   return this.save();
// };

// claimSchema.methods.markAsPaid = function (paymentDetails, userId) {
//   this.status = "Paid";
//   this.paymentDetails = { ...paymentDetails, paidAt: new Date() };
//   this.statusHistory.push({
//     status: "Paid",
//     changedBy: userId || null,
//     changedAt: new Date(),
//     comment: `Payment processed via ${paymentDetails.method}`,
//   });
//   return this.save();
// };

// // Static methods
// claimSchema.statics.getByStatus = function (status) {
//   return this.find({ status }).populate("user assignedTo").sort({ createdAt: -1 });
// };

// claimSchema.statics.getUserStats = async function (userId) {
//   const stats = await this.aggregate([
//     { $match: { user: mongoose.Types.ObjectId(userId) } },
//     {
//       $group: {
//         _id: "$status",
//         count: { $sum: 1 },
//         totalAmount: { $sum: "$claimAmount" },
//         approvedAmount: { $sum: "$approvedAmount" },
//       },
//     },
//   ]);
//   const summary = { total: 0, totalClaimAmount: 0, totalApprovedAmount: 0, byStatus: {} };
//   stats.forEach((stat) => {
//     summary.total += stat.count;
//     summary.totalClaimAmount += stat.totalAmount;
//     summary.totalApprovedAmount += stat.approvedAmount;
//     summary.byStatus[stat._id.toLowerCase().replace(/\s+/g, "_")] = {
//       count: stat.count,
//       totalAmount: stat.totalAmount,
//       approvedAmount: stat.approvedAmount,
//     };
//   });
//   return summary;
// };

// claimSchema.set("toJSON", { virtuals: true });
// claimSchema.set("toObject", { virtuals: true });

// module.exports = mongoose.models.Claim || mongoose.model("Claim", claimSchema);
const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  
  claimNumber: {
    type: String,
    unique: true,
    trim: true
  },
  
  policyNumber: {
    type: String,
    required: [true, 'Policy number is required'],
    trim: true
  },
  
  // FIXED: Made policyType flexible - accepts any string
  policyType: {
    type: String,
    required: [true, 'Policy type is required'],
    trim: true
    // Removed enum to allow any policy type
  },
  
  // FIXED: Made claimType flexible - accepts any string
  claimType: {
    type: String,
    required: [true, 'Claim type is required'],
    trim: true
    // Removed enum to allow any claim type
  },
  
  incidentDate: {
    type: Date,
    required: [true, 'Incident date is required']
  },
  
  claimAmount: {
    type: Number,
    required: [true, 'Claim amount is required'],
    min: [0, 'Claim amount cannot be negative']
  },
  
  approvedAmount: {
    type: Number,
    min: [0, 'Approved amount cannot be negative'],
    default: 0
  },
  
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  location: {
    type: String,
    trim: true
  },
  
  // FIXED: Changed witnesses from embedded schema to simple array of strings
  witnesses: {
    type: [String],
    default: []
  },
  
  policeReportNumber: {
    type: String,
    trim: true
  },
  
  hospitalName: {
    type: String,
    trim: true
  },
  
  doctorName: {
    type: String,
    trim: true
  },
  
  diagnosisDetails: {
    type: String,
    trim: true
  },
  
  status: {
    type: String,
    enum: {
      values: ['Submitted', 'Under Review', 'Documents Required', 'Approved', 'Rejected', 'Paid', 'Closed'],
      message: '{VALUE} is not a valid status'
    },
    default: 'Submitted'
  },
  
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high', 'urgent'],
      message: '{VALUE} is not a valid priority'
    },
    default: 'medium'
  },
  
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  rejectionReason: {
    type: String,
    trim: true
  },
  
  paymentDetails: {
    method: {
      type: String,
      enum: ['Bank Transfer', 'Mobile Money', 'Cheque', 'Cash'],
      trim: true
    },
    accountNumber: {
      type: String,
      trim: true
    },
    accountName: {
      type: String,
      trim: true
    },
    bankName: {
      type: String,
      trim: true
    },
    bankBranch: {
      type: String,
      trim: true
    },
    transactionId: {
      type: String,
      trim: true
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    paidAt: {
      type: Date
    }
  },
  
  documents: [{
    documentType: {
      type: String,
      required: true,
      trim: true
    },
    fileName: {
      type: String,
      required: true,
      trim: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      trim: true
    },
    fileSize: {
      type: Number
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  notes: [{
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    note: {
      type: String,
      required: true,
      trim: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    comment: {
      type: String,
      trim: true
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ==========================================
// INDEXES
// ==========================================
claimSchema.index({ user: 1, createdAt: -1 });
claimSchema.index({ claimNumber: 1 });
claimSchema.index({ policyNumber: 1 });
claimSchema.index({ status: 1 });
claimSchema.index({ assignedTo: 1 });
claimSchema.index({ createdAt: -1 });

// ==========================================
// PRE-SAVE MIDDLEWARE
// ==========================================

// Generate claim number before saving
claimSchema.pre('save', async function(next) {
  if (!this.claimNumber) {
    const count = await mongoose.model('Claim').countDocuments();
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    this.claimNumber = `CLM-${year}${month}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Add initial status history entry
claimSchema.pre('save', function(next) {
  if (this.isNew) {
    this.statusHistory.push({
      status: this.status,
      changedBy: this.user,
      changedAt: new Date(),
      comment: 'Claim submitted'
    });
  }
  next();
});

// ==========================================
// INSTANCE METHODS
// ==========================================

/**
 * Add a note to the claim
 */
claimSchema.methods.addNote = function(userId, noteText) {
  this.notes.push({
    addedBy: userId,
    note: noteText,
    addedAt: new Date()
  });
  return this.save();
};

/**
 * Update claim status
 */
claimSchema.methods.updateStatus = function(newStatus, userId, comment = '') {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    changedBy: userId,
    changedAt: new Date(),
    comment
  });
  return this.save();
};

/**
 * Approve claim
 */
claimSchema.methods.approveClaim = function(approvedAmount, userId) {
  this.status = 'Approved';
  this.approvedAmount = approvedAmount;
  this.statusHistory.push({
    status: 'Approved',
    changedBy: userId,
    changedAt: new Date(),
    comment: `Claim approved for amount: ${approvedAmount}`
  });
  return this.save();
};

/**
 * Reject claim
 */
claimSchema.methods.rejectClaim = function(reason, userId) {
  this.status = 'Rejected';
  this.rejectionReason = reason;
  this.statusHistory.push({
    status: 'Rejected',
    changedBy: userId,
    changedAt: new Date(),
    comment: reason
  });
  return this.save();
};

/**
 * Mark claim as paid
 */
claimSchema.methods.markAsPaid = function(paymentDetails, userId) {
  this.status = 'Paid';
  this.paymentDetails = {
    ...this.paymentDetails,
    ...paymentDetails,
    paidBy: userId,
    paidAt: new Date()
  };
  this.statusHistory.push({
    status: 'Paid',
    changedBy: userId,
    changedAt: new Date(),
    comment: `Payment processed via ${paymentDetails.method}`
  });
  return this.save();
};

// ==========================================
// STATIC METHODS
// ==========================================

/**
 * Get claims statistics for a user
 */
claimSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$claimAmount' },
        approvedAmount: { $sum: '$approvedAmount' }
      }
    }
  ]);
  
  const result = {
    total: 0,
    byStatus: {},
    totalClaimed: 0,
    totalApproved: 0
  };
  
  stats.forEach(item => {
    result.byStatus[item._id] = item.count;
    result.total += item.count;
    result.totalClaimed += item.totalAmount;
    result.totalApproved += item.approvedAmount;
  });
  
  return result;
};

/**
 * Get pending claims (submitted or under review)
 */
claimSchema.statics.getPendingClaims = function() {
  return this.find({
    status: { $in: ['Submitted', 'Under Review'] }
  })
  .populate('user', 'firstName lastName email phone')
  .populate('assignedTo', 'firstName lastName email')
  .sort({ priority: -1, createdAt: 1 });
};

/**
 * Get claims by policy number
 */
claimSchema.statics.getByPolicyNumber = function(policyNumber) {
  return this.find({ policyNumber })
    .populate('user', 'firstName lastName email phone')
    .sort('-createdAt');
};

/**
 * Get high priority claims
 */
claimSchema.statics.getHighPriorityClaims = function() {
  return this.find({
    priority: { $in: ['high', 'urgent'] },
    status: { $nin: ['Paid', 'Closed', 'Rejected'] }
  })
  .populate('user', 'firstName lastName email phone')
  .populate('assignedTo', 'firstName lastName email')
  .sort({ priority: -1, createdAt: 1 });
};

// ==========================================
// VIRTUALS
// ==========================================

// Calculate processing time
claimSchema.virtual('processingDays').get(function() {
  if (this.status === 'Paid' || this.status === 'Closed' || this.status === 'Rejected') {
    const days = Math.floor((this.updatedAt - this.createdAt) / (1000 * 60 * 60 * 24));
    return days;
  }
  return null;
});

// Check if claim is overdue (more than 30 days in review)
claimSchema.virtual('isOverdue').get(function() {
  if (this.status === 'Under Review') {
    const daysSinceCreation = Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
    return daysSinceCreation > 30;
  }
  return false;
});

// ==========================================
// QUERY HELPERS
// ==========================================

claimSchema.query.byStatus = function(status) {
  return this.where({ status });
};

claimSchema.query.byUser = function(userId) {
  return this.where({ user: userId });
};

claimSchema.query.byPriority = function(priority) {
  return this.where({ priority });
};

claimSchema.query.pending = function() {
  return this.where({
    status: { $in: ['Submitted', 'Under Review', 'Documents Required'] }
  });
};

claimSchema.query.completed = function() {
  return this.where({
    status: { $in: ['Paid', 'Closed'] }
  });
};

// ==========================================
// MODEL EXPORT
// ==========================================

const Claim = mongoose.model('Claim', claimSchema);

module.exports = Claim;