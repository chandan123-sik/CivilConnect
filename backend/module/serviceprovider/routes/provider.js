const express = require('express');
const router = express.Router();
const auth = require('../../../middleware/auth');
const checkRole = require('../../../middleware/checkRole');
const { uploadKYC, uploadProfile } = require('../../../middleware/upload');
const checkSubscription = require('../../../middleware/checkSubscription');
const {
  createProviderProfile,
  getProviderProfile,
  updateProviderProfile,
  toggleOnlineStatus,
  getProviderDashboard,
  getWorkers,
  addWorker,
  updateWorker,
  deleteWorker,
  submitFeedback,
  submitReport,
  getReports,
  initiateSubscription,
  verifyPayment
} = require('../controllers/providerController');

// All routes here require token
router.post('/create-profile', auth, uploadKYC.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'workImage', maxCount: 1 },
  { name: 'aadharImage', maxCount: 1 },
  { name: 'policeVerifyImage', maxCount: 1 }
]), createProviderProfile);

// Apply subscription guard to all following routes
router.use(auth, checkRole('provider'), checkSubscription);

router.get('/profile', getProviderProfile);
router.put('/profile', uploadKYC.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'workImage', maxCount: 1 },
  { name: 'aadharImage', maxCount: 1 },
  { name: 'policeVerifyImage', maxCount: 1 }
]), updateProviderProfile);
router.patch('/status', toggleOnlineStatus);
router.get('/dashboard', getProviderDashboard);

// Workers Management
router.get('/workers', getWorkers);
router.post('/workers', uploadProfile.single('image'), addWorker);
router.put('/workers/:id', uploadProfile.single('image'), updateWorker);
router.delete('/workers/:id', deleteWorker);

// Feedback & Reports
router.post('/feedback', submitFeedback);
router.post('/report', submitReport);
router.get('/report', getReports);
router.post('/subscribe', initiateSubscription);
router.post('/verify-payment', verifyPayment);

module.exports = router;
