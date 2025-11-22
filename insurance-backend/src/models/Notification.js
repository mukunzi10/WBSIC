const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        'NEW_CLAIM',
        'CLAIM_APPROVED',
        'CLAIM_REJECTED',
        'PAYMENT_PROCESSED',
        'GENERAL',
      ],
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed, // can store claim data, message, etc.
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Mark notification as read
notificationSchema.methods.markAsRead = function () {
  this.read = true;
  this.readAt = new Date();
  return this.save();
};

// Index for faster querying unread notifications per user
notificationSchema.index({ recipient: 1, read: 1 });

module.exports =
  mongoose.models.Notification ||
    mongoose.model('Notification', notificationSchema);
  
