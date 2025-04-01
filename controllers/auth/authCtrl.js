// controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User/User.model');
const { generateOTP, sendEmailOTP, sendSMSOTP } = require('../../services/otp-service');
require('dotenv').config();
    
const authCtrl = {
  register: async (req, res) => {
    const { name, username, password, email, telephone } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: 'Email already registered' });

      const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
      const otp = generateOTP();
      const otpExpires = new Date(Date.now() + 5 * 60000);

      user = new User({
        name,
        username,
        email,
        telephone,
        password: hashedPassword,
        typeLogin: password ? 'UserPwd' : 'OTP',
        otp,
        otpExpires,
      });

      await user.save();
      if (telephone) await sendSMSOTP(telephone, otp);

      res.json({ message: 'OTP sent. Please verify.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  verifyOTP: async (req, res) => {
    const { email, telephone, otp } = req.body;
    try {
      const user = await User.findOne({ $or: [{ email }, { telephone }] });
      if (!user || user.otp !== otp || new Date() > user.otpExpires) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }

      user.otp = null;
      user.otpExpires = null;
      await user.save();

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, user });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  loginWithPassword: async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) return res.status(400).json({ message: 'User not found' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, user });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  loginWithOTP: async (req, res) => {
    const { email, telephone } = req.body;
    try {
      const user = await User.findOne({ $or: [{ email }, { telephone }] });
      if (!user) return res.status(400).json({ message: 'User not found' });

      const otp = generateOTP();
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 5 * 60000);
      await user.save();

      if (email) await sendEmailOTP(email, otp);
      if (telephone) await sendSMSOTP(telephone, otp);

      res.json({ message: 'OTP sent. Please verify.' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  googleCallback: async (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: req.user });
  },

  appleCallback: async (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: req.user });
  },
};

module.exports = authCtrl;
