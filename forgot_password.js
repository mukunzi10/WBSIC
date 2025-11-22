// forgot_password.js
// Handles forgot password requests

const { generateToken, sendToken } = require('./send_token');

// Simulate a "users database" (replace with real DB in production)
const usersDB = [
    { email: 'user1@example.com' },
    { email: 'user2@example.com' },
];

/**
 * Handle forgot password
 * @param {string} email
 */
function forgotPassword(email) {
    // Check if user exists
    const user = usersDB.find(u => u.email === email);
    if (!user) {
        console.log('Email not found in the database');
        return;
    }

    // Generate a token
    const token = generateToken(6);

    // Send token
    sendToken(email, token);

    console.log(`Password reset token sent to ${email}`);
}

// Example usage
const emailToReset = 'user1@example.com';
forgotPassword(emailToReset);

module.exports = { forgotPassword };
