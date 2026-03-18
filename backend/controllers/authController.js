const { generateOTP, verifyOTP } = require('../utils/generateOTP');
const sendOTP = require('../utils/sendOTP');
const User = require('../module/user/models/User');
const Provider = require('../module/serviceprovider/models/Provider');
const generateToken = require('../utils/generateToken');
const { successRes, errorRes } = require('../utils/apiResponse');

// @desc    Send OTP to phone
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTPHandler = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return errorRes(res, 'Phone number is required');
  }

  try {
    const otp = generateOTP(phone);
    await sendOTP(phone, otp);

    return successRes(res, null, 'OTP sent successfully');
  } catch (error) {
    console.error(error);
    return errorRes(res, 'Error sending OTP');
  }
};

// @desc    Verify OTP and Login
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTPHandler = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return errorRes(res, 'Phone and OTP are required');
  }

  try {
    const isValid = verifyOTP(phone, otp);

    if (!isValid) {
      return errorRes(res, 'Invalid or expired OTP', 400);
    }

    // Check if user exists (User collection)
    let actor = await User.findOne({ phone });
    let role = 'user';

    // If not found in User, check Provider collection
    if (!actor) {
      actor = await Provider.findOne({ phone });
      role = 'provider';
    }

    // Role detection and token issuance
    if (!actor) {
      // New User or Provider - let frontend choose role
      const tempToken = generateToken('temp', 'temp-role');
      // We pass the phone in the token payload natively via auth middleware logic if we could, 
      // but the easiest is simply adding phone to the token via raw jwt.sign.
      const jwt = require('jsonwebtoken');
      const realTempToken = jwt.sign({ phone, isTemp: true }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return successRes(res, { isNew: true, phone, token: realTempToken }, 'OTP verified. Proceed to role selection.');
    }

    // Generate token
    const token = generateToken(actor._id, role);

    return successRes(res, {
      token,
      role,
      user: {
        id: actor._id,
        fullName: actor.fullName,
        phone: actor.phone,
        profileImage: actor.profileImage,
        subscriptionExpiry: actor.subscriptionExpiry,
        isSubscriptionActive: role === 'provider' ? (actor.subscriptionExpiry && new Date(actor.subscriptionExpiry) > new Date()) : true
      }
    }, 'Login successful');

  } catch (error) {
    console.error(error);
    return errorRes(res, 'Server Error during OTP verification');
  }
};

module.exports = {
  sendOTPHandler,
  verifyOTPHandler,
};
