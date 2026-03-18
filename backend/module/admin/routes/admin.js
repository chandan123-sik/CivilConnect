const express = require('express');
const router = express.Router();
const auth = require('../../../middleware/auth');
const checkRole = require('../../../middleware/checkRole');
const {
  adminLogin,
  getDashboardStats,
  getPendingApprovals,
  updateApprovalStatus,
  getAllUsers,
  toggleUserStatus,
  getAllProviders,
  toggleProviderStatus,
  manageCategory,
  manageMaterial,
  manageBanner,
  manageOrder,
  getAllLeads,
  managePlan,
  getSettings,
  updateSettings,
  getFeedbacks,
  clearFeedbacks,
  getAllReports,
  replyToReport,
  deleteReport,
  getNotifications,
  markNotificationsRead,
  getPlatformHealth,
  getRevenueDashboard,
  deleteProvider
} = require('../controllers/adminController');
const { uploadProfile, uploadMaterial, uploadBanner } = require('../../../middleware/upload');

// POST /api/admin/login - Admin Authentication
router.post('/login', adminLogin);

// All following routes require admin auth
router.use(auth, checkRole('admin'));

// Dashboard & Approvals
router.get('/dashboard', getDashboardStats);
router.get('/revenue', getRevenueDashboard);
router.get('/health', getPlatformHealth);
router.get('/approvals', getPendingApprovals);
router.patch('/approvals/:id', updateApprovalStatus);

// Management
router.get('/users', getAllUsers);
router.patch('/users/:id/status', toggleUserStatus);
router.get('/providers', getAllProviders);
router.patch('/providers/:id/status', toggleProviderStatus);
router.delete('/providers/:id', deleteProvider);
router.get('/leads', getAllLeads);

// Resource Management routes (Post/Put/Delete)
router.get('/plans', (req, res) => managePlan(req, res, 'list'));
router.post('/plans', (req, res) => managePlan(req, res, 'create'));
router.put('/plans/:id', (req, res) => managePlan(req, res, 'update'));
router.delete('/plans/:id', (req, res) => managePlan(req, res, 'delete'));
router.post('/categories', uploadProfile.single('icon'), (req, res) => manageCategory(req, res, 'create'));
router.put('/categories/:id', uploadProfile.single('icon'), (req, res) => manageCategory(req, res, 'update'));
router.delete('/categories/:id', (req, res) => manageCategory(req, res, 'delete'));

router.post('/materials', uploadMaterial.single('image'), (req, res) => manageMaterial(req, res, 'create'));
router.put('/materials/:id', uploadMaterial.single('image'), (req, res) => manageMaterial(req, res, 'update'));
router.delete('/materials/:id', (req, res) => manageMaterial(req, res, 'delete'));

router.get('/banners', (req, res) => manageBanner(req, res, 'list'));
router.post('/banners', uploadBanner.single('image'), (req, res) => manageBanner(req, res, 'create'));
router.put('/banners/:id', uploadBanner.single('image'), (req, res) => manageBanner(req, res, 'update'));
router.delete('/banners/:id', (req, res) => manageBanner(req, res, 'delete'));

// Reports
router.get('/reports', getAllReports);
router.patch('/reports/:id/reply', replyToReport);
router.delete('/reports/:id', deleteReport);

router.get('/orders', (req, res) => manageOrder(req, res, 'list'));
router.patch('/orders/:id', (req, res) => manageOrder(req, res, 'process'));

router.get('/settings/policy', getSettings);
router.put('/settings/policy', updateSettings);
router.get('/feedback', getFeedbacks);
router.delete('/feedback', clearFeedbacks);

// Notifications
router.get('/notifications', getNotifications);
router.patch('/notifications/read', markNotificationsRead);


module.exports = router;
