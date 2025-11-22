/**
 * Utility for sending notifications
 * Can be extended for email, SMS, push, etc.
 */

const Notification = require('../models/Notification'); // optional if you store notifications
const User = require('../models/User');

exports.sendNotification = async (type, recipient, payload) => {
  try {
    // Example: save notification to DB
    // You can extend to send email or push notification
    await Notification.create({
      type,
      recipient: recipient._id,
      payload,
      read: false,
    });

    // Log notification
    console.log(`🔔 Notification sent: ${type} -> ${recipient.email}`);
  } catch (error) {
    console.error('❌ Failed to send notification:', error.message);
  }
};

