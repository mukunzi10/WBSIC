const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  policyNumber: {
    type: String,
    required: true,
    unique: true
  },
  holder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Life Insurance', 'Health Insurance', 'Motor Insurance', 'Property Insurance', 'Travel Insurance', 'Business Insurance']
  },
  premium: {
    type: Number,
    required: true
  },
  coverage: {
    type: Number,
    required: true
  },
  paymentFrequency: {
    type: String,
    enum: ['Monthly', 'Quarterly', 'Annually', 'One-time'],
    default: 'Monthly'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  nextPayment: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Active', 'Pending', 'Lapsed', 'Expired', 'Cancelled'],
    default: 'Pending'
  },
  beneficiary: {
    name: String,
    relationship: String,
    phone: String
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalPaid: {
    type: Number,
    default: 0
  },
  notes: String
}, {
  timestamps: true
});

// Generate unique policy number
policySchema.pre('save', async function(next) {
  if (!this.policyNumber) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments();
    this.policyNumber = `POL-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Policy', policySchema);