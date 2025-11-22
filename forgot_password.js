// forgot password logic 
// send_token.js
// This module generates a simple token and "sends" it (console or email)

const crypto = require('crypto');

/**
 * Generate a random token
 * @param {number} length - token length
 * @returns {string} - random token
 */
function generateToken(length = 6) {
    // Generate random bytes, convert to hex, slice to desired length
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}

/**
 * Send token to user
 * @param {string} email - user's email
 * @param {string} token - token to send
 */
function sendToken(email, token) {
    // For now, just print to console
    console.log(`Sending token to ${email}: ${token}`);

    // TODO: integrate with real email service like Nodemailer or SendGrid
}

module.exports = { generateToken, sendToken };
