const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User/User.model');
const passport = require('../../shared/passport-config')
const { generateOTP, sendEmailOTP, sendSMSOTP } = require('../../services/otp-service');
require('dotenv').config();

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication APIs
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               telephone:
 *                 type: string
 *                 example: "+123456789"
 *               password:
 *                 type: string
 *                 example: SecurePass123!
 *     responses:
 *       200:
 *         description: OTP sent for verification
 *       400:
 *         description: Email already registered
 */
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

        if (telephone) await sendSMSOTP(telephone, otp);

        res.json({ message: 'OTP sent. Please verify.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP for account activation
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               telephone:
 *                 type: string
 *                 example: "+123456789"
 *               otp:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: OTP verified, user authenticated
 *       400:
 *         description: Invalid or expired OTP
 */
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

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with username and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: SecurePass123!
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       400:
 *         description: Invalid credentials or user not found
 */
router.post('/login', async (req, res) => {
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
});

/**
 * @swagger
 * /auth/login-otp:
 *   post:
 *     summary: Login using OTP
 *     tags: [Authentication]
 */
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

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Login with Google OAuth
 *     tags: [Authentication]
 */
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Authentication]
 */
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: req.user });
});

/**
 * @swagger
 * /auth/apple:
 *   get:
 *     summary: Login with Apple OAuth
 *     tags: [Authentication]
 */
router.get('/auth/apple', passport.authenticate('apple'));

/**
 * @swagger
 * /auth/apple/callback:
 *   post:
 *     summary: Apple OAuth callback
 *     tags: [Authentication]
 */
router.post('/auth/apple/callback', passport.authenticate('apple', { failureRedirect: '/' }), (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: req.user });
});

module.exports = router;