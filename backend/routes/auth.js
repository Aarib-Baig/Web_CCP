const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper: Create JWT token
const createToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Helper: Format user response
const userResponse = (user, token) => ({
  token,
  user: { id: user._id, name: user.name, email: user.email, role: user.role }
});

// POST /api/auth/register - Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Simple validation
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check existing user
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user with hashed password
    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      phone,
      role: role || 'customer'
    });

    res.status(201).json(userResponse(user, createToken(user)));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login - Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user and verify password
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json(userResponse(user, createToken(user)));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;