const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
      enum: [
        'Life Insurance',
        'Health Insurance',
        'Motor Insurance',
        'Home Insurance',
        'Travel Insurance',
        'Business Insurance',
        'Education Plan',
        'Investment Plans',
        'Group Insurance'
      ]
    },
    category: {
      type: String,
      required: true,
      enum: ['life', 'health', 'motor', 'property', 'travel', 'business', 'savings', 'group']
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    features: [{
      type: String,
      trim: true
    }],
    premiumRange: {
      min: {
        type: Number,
        required: true,
        min: 0
      },
      max: {
        type: Number,
        min: 0
      },
      period: {
        type: String,
        enum: ['month', 'year', 'trip', 'custom'],
        default: 'month'
      }
    },
    coverageAmount: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'RWF'
      }
    },
    eligibility: {
      minAge: Number,
      maxAge: Number,
      requirements: [String]
    },
    documents: [{
      name: String,
      required: Boolean
    }],
    terms: {
      type: String,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    popularityScore: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

// Index for searching
serviceSchema.index({ name: 'text', description: 'text' });
serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ popularityScore: -1 });

// Virtual for display premium
serviceSchema.virtual('displayPremium').get(function() {
  if (this.premiumRange.max) {
    return `${this.premiumRange.min.toLocaleString()} - ${this.premiumRange.max.toLocaleString()} RWF/${this.premiumRange.period}`;
  }
  return `From ${this.premiumRange.min.toLocaleString()} RWF/${this.premiumRange.period}`;
});

serviceSchema.set('toJSON', { virtuals: true });
serviceSchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.Service || mongoose.model('Service', serviceSchema);
