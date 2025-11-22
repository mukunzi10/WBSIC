// register page
// register.js

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// REGISTER ROUTE
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: "Registration successful" });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
