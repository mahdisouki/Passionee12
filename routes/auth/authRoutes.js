const express = require('express');
const passport = require('../../shared/passport-config');
const authCtrl = require('../../controllers/auth/authCtrl');

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
 *               name: { type: string, example: John Doe }
 *               username: { type: string, example: johndoe }
 *               email: { type: string, example: johndoe@example.com }
 *               telephone: { type: string, example: "+123456789" }
 *               password: { type: string, example: SecurePass123! }
 *     responses:
 *       200: { description: OTP sent for verification }
 *       400: { description: Email already registered }
 */
router.post('/register', authCtrl.register);

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
 *               email: { type: string, example: johndoe@example.com }
 *               telephone: { type: string, example: "+123456789" }
 *               otp: { type: string, example: "1234" }
 *     responses:
 *       200: { description: OTP verified, user authenticated }
 *       400: { description: Invalid or expired OTP }
 */
router.post('/verify-otp', authCtrl.verifyOTP);

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
 *               username: { type: string, example: johndoe }
 *               password: { type: string, example: SecurePass123! }
 *     responses:
 *       200: { description: Login successful, returns JWT token }
 *       400: { description: Invalid credentials or user not found }
 */
router.post('/login', authCtrl.loginWithPassword);

/**
 * @swagger
 * /auth/login-otp:
 *   post:
 *     summary: Login using OTP
 *     tags: [Authentication]
 */
router.post('/login-otp', authCtrl.loginWithOTP);

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
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), authCtrl.googleCallback);

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
router.post('/auth/apple/callback', passport.authenticate('apple', { failureRedirect: '/' }), authCtrl.appleCallback);

module.exports = router;
