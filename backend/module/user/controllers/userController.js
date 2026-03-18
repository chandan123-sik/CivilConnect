const User = require('../models/User');
const Order = require('../models/Order');
const Material = require('../../admin/models/Material');
const Feedback = require('../../admin/models/Feedback');
const Report = require('../../admin/models/Report');
const { successRes, errorRes } = require('../../../utils/apiResponse');

// @desc    Complete profile after OTP
const completeProfile = async (req, res) => {
  const { fullName, email, city, area, gender } = req.body;
  const phone = req.user.phone; 

  try {
    let user = await User.findOne({ phone });

    const profileData = {
      fullName,
      email,
      city,
      area,
      gender,
      profileImage: req.file ? req.file.path : undefined,
    };

    if (user) {
      user = await User.findByIdAndUpdate(user._id, { $set: profileData }, { returnDocument: 'after' });
    } else {
      user = await User.create({ ...profileData, phone });
    }

    const generateToken = require('../../../utils/generateToken');
    const token = generateToken(user._id, 'user');

    return successRes(res, { user, token }, 'Profile completed successfully');
  } catch (error) {
    console.error(error);
    return errorRes(res, 'Error completing profile');
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return errorRes(res, 'User not found', 404);
    return successRes(res, user);
  } catch (error) {
    return errorRes(res, 'Error fetching profile');
  }
};

const updateUserProfile = async (req, res) => {
  const { fullName, email, city, area, gender } = req.body;
  try {
    const updateData = { fullName, email, city, area, gender };
    if (req.file) updateData.profileImage = req.file.path;

    const user = await User.findByIdAndUpdate(req.user.id, { $set: updateData }, { returnDocument: 'after' });
    return successRes(res, user, 'Profile updated successfully');
  } catch (error) {
    return errorRes(res, 'Error updating profile');
  }
};

const createOrder = async (req, res) => {
  const { materialId, brand, quantity, totalPrice, materialName, unit } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    const order = await Order.create({
      userId,
      userName: user.fullName,
      userPhone: user.phone,
      userAddress: `${user.city}, ${user.area}`,
      materialId,
      materialName,
      brand,
      unit,
      quantity,
      totalPrice,
      status: 'pending'
    });

    return successRes(res, order, 'Order placed successfully');
  } catch (error) {
    console.error(error);
    return errorRes(res, 'Error placing order');
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return successRes(res, orders);
  } catch (error) {
    return errorRes(res, 'Error fetching orders');
  }
};

const submitFeedback = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const feedback = await Feedback.create({
      name: user.fullName || 'Unknown User',
      role: 'User',
      stars: req.body.stars,
      comment: req.body.comment
    });
    return successRes(res, feedback, 'Feedback submitted successfully');
  } catch (err) {
    return errorRes(res, 'Error submitting feedback');
  }
};

const submitReport = async (req, res) => {
  try {
    const report = await Report.create({
      senderId: req.user.id,
      senderModel: 'User',
      message: req.body.message
    });
    return successRes(res, report, 'Report sent successfully');
  } catch (err) {
    return errorRes(res, 'Error passing report');
  }
};

const getReports = async (req, res) => {
  try {
    const reports = await Report.find({ senderId: req.user.id }).sort({ createdAt: -1 });
    return successRes(res, reports, 'Reports fetched');
  } catch (err) {
    return errorRes(res, 'Error fetching reports');
  }
};

module.exports = {
  completeProfile,
  getUserProfile,
  updateUserProfile,
  createOrder,
  getOrders,
  submitFeedback,
  submitReport,
  getReports
};
