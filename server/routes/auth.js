const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require("nodemailer");
const otpStore = {}; // Temporary storage for OTPs (use Redis for production)

const router = express.Router();
const JWT_SECRET = 'Guru@2004'; // Replace with `.env` variable

// Admin Email (Fixed)
const ADMIN_EMAIL = 'guruprasaaths.22cse@kongu.edu';

// User Login
// router.post('/register', async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already in use" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ name, email, password: hashedPassword, isAdmin: false });

//     await newUser.save();
//     res.json({ message: "User registered successfully" });

//   } catch (error) {
//     console.error("Error registering user:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

router.post('/register', async (req, res) => {
  try {
    console.log("🚀 Register API Hit");
    const { name, email, password } = req.body;
    console.log("Received Data:", { name, email, password });

    if (!email.endsWith("@kongu.edu")) {
      console.log("Invalid Email Domain");
      return res.status(400).json({ message: "Only @kongu.edu emails are allowed." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User Already Exists");
      return res.status(400).json({ message: "Email already in use." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("Generated OTP:", otp);

    otpStore[email] = otp;

    const mailOptions = {
      from: "gurukprs@gmail.com",  // Update your email here
      to: email,
      subject: "Your OTP for Expense Tracker",
      text: `Your OTP for registration is ${otp}`,
    };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "gurukprs@gmail.com",  // Your Gmail ID
        pass: "zhfp gxbn giyn bcan"    // Your App Password
      }
    });

    console.log("Sending Email...");
    await transporter.sendMail(mailOptions);
    console.log("Email Sent Successfully");

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//JWT Cookies
router.get('/verify', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'No token, unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ 
      isAdmin: decoded.isAdmin,
      userId: decoded.userId 
    });
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!otpStore[email] || otpStore[email] !== parseInt(otp)) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, isAdmin: false });

    await newUser.save();
    delete otpStore[email]; // Remove OTP after successful registration

    res.json({ message: "Registration successful! You can now log in." });

  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//1st method for login
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

//     // ✅ Include user's name in response
//     res.json({ token, isAdmin, name: user.name, email: user.email });
//   } catch (error) {
//     console.error('Login Error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });


//2nd method for login
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // ✅ Enforce @kongu.edu email check
//     if (!email.endsWith("@kongu.edu")) {
//       return res.status(400).json({ message: "Only @kongu.edu emails are allowed." });
//     }

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'User not found' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

//     const isAdmin = user.email === ADMIN_EMAIL;
//     const token = jwt.sign({ userId: user._id, isAdmin }, JWT_SECRET, { expiresIn: '1h' });

//     res.json({ token, isAdmin, name: user.name, email: user.email });
//   } catch (error) {
//     console.error('Login Error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

//login with JWT Cookies
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Enforce @kongu.edu email check
    if (!email.endsWith("@kongu.edu")) {
      return res.status(400).json({ message: "Only @kongu.edu emails are allowed." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const isAdmin = user.email === ADMIN_EMAIL;
    const token = jwt.sign({ userId: user._id, isAdmin }, JWT_SECRET, { expiresIn: '1h' });

    // ✅ Set token in HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true if deployed with HTTPS
      sameSite: 'Lax',
      maxAge: 1000 * 60 * 60, // 1 hour
    });

    // ✅ Send additional user info (no token in body)
    res.json({ isAdmin, name: user.name, email: user.email });
    
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production',
  });
  res.json({ message: 'Logged out successfully' });
});


module.exports = router;
