// const express = require('express');
// const { register, login } = require('../controllers/authController');
// const router = express.Router();

// router.post('/register', register);
// router.post('/login', login);

// module.exports = router;
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = 'Guru@2004'; // Replace with `.env` variable

// Admin Email (Fixed)
const ADMIN_EMAIL = 'guruprasaaths.22cse@kongu.edu';

// User Login
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, isAdmin: false });

    await newUser.save();
    res.json({ message: "User registered successfully" });

  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) return res.status(400).json({ message: 'User not found' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

//     // Check if Admin
//     const isAdmin = user.email === ADMIN_EMAIL;

//     const token = jwt.sign({ userId: user._id, isAdmin }, JWT_SECRET, { expiresIn: '1h' });

//     res.json({ token, isAdmin });
//   } catch (error) {
//     console.error('Login Error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    // Check if Admin
    const isAdmin = user.email === ADMIN_EMAIL;

    const token = jwt.sign({ userId: user._id, isAdmin }, JWT_SECRET, { expiresIn: '1h' });

    // ✅ Include user's name in response
    res.json({ token, isAdmin, name: user.name, email: user.email });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
