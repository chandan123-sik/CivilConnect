const express = require('express');
const router = express.Router();
const { sendOTPHandler, verifyOTPHandler } = require('../controllers/authController');

// POST /api/auth/send-otp
router.post('/send-otp', sendOTPHandler);

// POST /api/auth/verify-otp
router.post('/verify-otp', verifyOTPHandler);

module.exports = router;
