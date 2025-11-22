// account_update.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("./db"); // your database connection

// Update user account
router.post("/update", async (req, res) => {
    const { userId, name, email, phone, password } = req.body;

    try {
        let updateFields = {
            name,
            email,
            phone
        };

        // If password is provided, hash it
        if (password && password.length > 0) {
            updateFields.password = await bcrypt.hash(password, 10);
        }

        await db.query(
            `UPDATE users SET name=?, email=?, phone=?, password=COALESCE(?, password)
             WHERE id=?`,
            [updateFields.name, updateFields.email, updateFields.phone, updateFields.password || null, userId]
        );

        res.json({ success: true, message: "Account updated successfully" });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: "Error updating account" });
    }
});

module.exports = router;
