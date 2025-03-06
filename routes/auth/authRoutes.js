const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User/User.model');
const passport = require('../../shared/passport-config')
const { generateOTP, sendEmailOTP, sendSMSOTP } = require('../../services/otp-service');
require('dotenv').config();

const router = express.Router();

// Register with OTP
router.post('/register', async (req, res) => {
    const { name, username, password, email, telephone } = req.body;
    
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'Email already registered' });

        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 5 * 60000); // OTP expires in 5 minutes

        user = new User({
            name, username, email, telephone,
            password: hashedPassword,
            typeLogin: password ? 'UserPwd' : 'OTP',
            otp, otpExpires
        });

        await user.save();

        // if (email) await sendEmailOTP(email, otp);
        if (telephone) await sendSMSOTP(telephone, otp);

        res.json({ message: 'OTP sent. Please verify.' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error });
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
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
});

// Login with Password
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body)
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' });
    }
});

// Login with OTP
router.post('/login-otp', async (req, res) => {
    const { email, telephone } = req.body;

    try {
        const user = await User.findOne({ $or: [{ email }, { telephone }] });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 5 * 60000); // OTP expires in 5 minutes
        await user.save();

        if (email) await sendEmailOTP(email, otp);
        if (telephone) await sendSMSOTP(telephone, otp);

        res.json({ message: 'OTP sent. Please verify.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
/** 📝 GOOGLE AUTH */
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: req.user });
});

/** 📝 APPLE AUTH */
router.get('/auth/apple', passport.authenticate('apple'));

router.post('/auth/apple/callback', passport.authenticate('apple', { failureRedirect: '/' }), (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: req.user });
});

module.exports = router;