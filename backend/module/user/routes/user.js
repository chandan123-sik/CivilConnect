const express = require('express');
const router = express.Router();
const auth = require('../../../middleware/auth');
const checkRole = require('../../../middleware/checkRole');
const { uploadProfile } = require('../../../middleware/upload');
const { completeProfile, getUserProfile, updateUserProfile, createOrder, getOrders, submitFeedback, submitReport, getReports } = require('../controllers/userController');

// All routes here are protected and for role 'user'
router.post('/complete-profile', auth, uploadProfile.single('profileImage'), completeProfile);
router.get('/profile', auth, checkRole('user'), getUserProfile);
router.put('/profile', auth, checkRole('user'), uploadProfile.single('profileImage'), updateUserProfile);

// Order Management
router.post('/orders', auth, checkRole('user'), createOrder);
router.get('/orders', auth, checkRole('user'), getOrders);

// Feedback & Reports
router.post('/feedback', auth, checkRole('user'), submitFeedback);
router.post('/report', auth, checkRole('user'), submitReport);
router.get('/report', auth, checkRole('user'), getReports);

module.exports = router;
