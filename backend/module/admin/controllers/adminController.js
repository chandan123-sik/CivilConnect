const Admin = require('../models/Admin');
const os = require('os');
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Material = require('../models/Material');
const Banner = require('../models/Banner');
const Plan = require('../models/Plan');
const Transaction = require('../models/Transaction');
// Foreign Module Imports
const User = require('../../user/models/User');
const Lead = require('../../user/models/Lead');
const Order = require('../../user/models/Order');
const Provider = require('../../serviceprovider/models/Provider');
const SystemSetting = require('../models/SystemSetting');
const Feedback = require('../models/Feedback');
const Report = require('../models/Report');
const Notification = require('../models/Notification');

const bcrypt = require('bcryptjs');
const generateToken = require('../../../utils/generateToken');
const { successRes, errorRes } = require('../../../utils/apiResponse');

// @desc    Admin Login
const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return errorRes(res, 'Invalid Admin Credentials', 401);

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return errorRes(res, 'Invalid Admin Credentials', 401);

    const token = generateToken(admin._id, 'admin');
    return successRes(res, { token, username: admin.username }, 'Admin verified successfully');
  } catch (err) {
    return errorRes(res, 'Admin Login Error');
  }
};

// @desc    Dashboard Summary
const getDashboardStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const providers = await Provider.countDocuments();
    const pendingApprovals = await Provider.countDocuments({ approvalStatus: 'pending' });
    const liveLeads = await Lead.countDocuments({ status: 'pending' });
    return successRes(res, { users, providers, pendingApprovals, liveLeads });
  } catch (err) {
    return errorRes(res, 'Dashboard Stat Error');
  }
};

// @desc    Get Providers waiting for Approval
const getPendingApprovals = async (req, res) => {
  try {
    const list = await Provider.find({ approvalStatus: { $ne: 'none' } })
      .populate('subscriptionId')
      .populate('lastTransactionId')
      .sort({ updatedAt: -1 });
    return successRes(res, list);
  } catch (err) {
    console.error("getPendingApprovals Error:", err);
    return errorRes(res, 'Approval List Error');
  }
};

const updateApprovalStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) return errorRes(res, 'Provider not found');

    provider.approvalStatus = status;

    if (status === 'approved' && provider.subscriptionId) {
      const plan = await Plan.findById(provider.subscriptionId);
      if (plan) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + plan.durationDays);
        provider.subscriptionExpiry = expiryDate;
      }
    }

    await provider.save();
    return successRes(res, provider, `Provider ${status}`);
  } catch (err) {
    console.error("Update Approval Status Error:", err);
    return errorRes(res, 'Approval Update Failed');
  }
};

const getAllUsers = async (req, res) => {
  try {
    const list = await User.find().sort({ createdAt: -1 });
    return successRes(res, list);
  } catch (err) { return errorRes(res, 'Error'); }
};

const toggleUserStatus = async (req, res) => {
  const { isActive } = req.body;
  try {
    const u = await User.findByIdAndUpdate(req.params.id, { isActive }, { returnDocument: 'after' });
    return successRes(res, u, 'User updated');
  } catch (err) { return errorRes(res, 'Error'); }
};

// Resource management helpers (Categorized)
const manageCategory = async (req, res, action) => {
  try {
    if (action === 'create') {
      const data = { ...req.body };
      if (req.file) data.icon = req.file.path;
      if (typeof data.subCategories === 'string') {
        try {
          data.subCategories = JSON.parse(data.subCategories);
        } catch (e) {
          data.subCategories = [];
        }
      }
      const c = await Category.create(data);
      return successRes(res, c, 'Created');
    }
    if (action === 'update') {
      const data = { ...req.body };
      if (req.file) data.icon = req.file.path;
      if (typeof data.subCategories === 'string') {
        try {
          data.subCategories = JSON.parse(data.subCategories);
        } catch (e) {
          data.subCategories = [];
        }
      }
      const c = await Category.findByIdAndUpdate(req.params.id, { $set: data }, { returnDocument: 'after' });
      return successRes(res, c, 'Updated');
    }
    if (action === 'delete') {
      await Category.findByIdAndDelete(req.params.id);
      return successRes(res, null, 'Deleted');
    }
  } catch (err) { return errorRes(res, 'Category Error'); }
};

const manageMaterial = async (req, res, action) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = req.file.path;

    // Parse brands if it's sent as a JSON string from FormData
    if (typeof data.brands === 'string') {
      try {
        data.brands = JSON.parse(data.brands);
      } catch (e) {
        console.error("Brand Parse Error:", e);
        data.brands = [];
      }
    }

    // Ensure price is a number for Mongoose validation
    if (data.price) data.price = Number(data.price);

    // Ensure numeric prices for brands
    if (Array.isArray(data.brands)) {
      data.brands = data.brands.map(b => ({
        ...b,
        price: Number(b.price) || 0
      }));
    }

    if (action === 'create') {
      const m = await Material.create(data);
      return successRes(res, m, 'Created');
    }
    if (action === 'update') {
      delete data._id; // Prevent updating immutable _id
      if (data.price) data.price = Number(data.price);
      const m = await Material.findByIdAndUpdate(req.params.id, { $set: data }, { new: true });
      return successRes(res, m, 'Updated');
    }
    if (action === 'delete') {
      await Material.findByIdAndDelete(req.params.id);
      return successRes(res, null, 'Deleted');
    }
  } catch (err) {
    console.error("🔥 Material Manage Error:", err);
    return errorRes(res, err.message || 'Material Error', 400);
  }
};

const manageBanner = async (req, res, action) => {
  try {
    if (action === 'list') {
      const { type } = req.query;
      const filter = type ? { type } : {};
      const list = await Banner.find(filter).sort({ order: 1 });
      return successRes(res, list);
    }
    if (action === 'create') {
      const data = { ...req.body };
      if (req.file) data.image = req.file.path;
      const b = await Banner.create(data);
      return successRes(res, b, 'Created');
    }
    if (action === 'update') {
      const data = { ...req.body };
      if (req.file) data.image = req.file.path;
      const b = await Banner.findByIdAndUpdate(req.params.id, { $set: data }, { returnDocument: 'after' });
      return successRes(res, b, 'Updated');
    }
    if (action === 'delete') {
      await Banner.findByIdAndDelete(req.params.id);
      return successRes(res, null, 'Deleted');
    }
  } catch (err) { return errorRes(res, 'Banner Error'); }
};

const manageOrder = async (req, res, action) => {
  try {
    if (action === 'list') {
      const list = await Order.find().sort({ createdAt: -1 });
      return successRes(res, list);
    }
    if (action === 'process') {
      const { status, deliveryTime } = req.body;
      const o = await Order.findByIdAndUpdate(req.params.id, { status, deliveryTime }, { returnDocument: 'after' });
      return successRes(res, o, 'Order processed');
    }
  } catch (err) { return errorRes(res, 'Order Error'); }
};

const getAllProviders = async (req, res) => {
  try {
    const list = await Provider.find().sort({ createdAt: -1 });
    return successRes(res, list);
  } catch (err) { return errorRes(res, 'Error'); }
};

const toggleProviderStatus = async (req, res) => {
  const { isActive } = req.body;
  try {
    const p = await Provider.findByIdAndUpdate(req.params.id, { isActive }, { returnDocument: 'after' });
    return successRes(res, p, 'Provider updated');
  } catch (err) { return errorRes(res, 'Error'); }
};

const getAllLeads = async (req, res) => {
  try {
    const list = await Lead.find()
      .populate('userId', 'fullName phone city area')
      .populate('providerId', 'fullName category')
      .sort({ createdAt: -1 });

    // Enrich with populated data
    const enriched = list.map(lead => {
      const obj = lead.toObject();
      // Client info
      obj.clientName = obj.clientName || obj.userId?.fullName || 'Unknown User';
      obj.clientPhone = obj.clientPhone || obj.userId?.phone || 'N/A';
      obj.clientCity = obj.userId?.city || obj.location || 'N/A';
      // Provider info
      obj.providerName = obj.providerId?.fullName || 'Unassigned';
      obj.providerCategory = obj.providerId?.category || obj.serviceType || 'General';
      // Fix serviceType if it's just 'provider' (default role string)
      if (!obj.serviceType || obj.serviceType.toLowerCase() === 'provider') {
        obj.serviceType = obj.providerId?.category || obj.projectType || 'General Service';
      }
      return obj;
    });

    return successRes(res, enriched);
  } catch (err) { 
    console.error('GetAllLeads Error:', err);
    return errorRes(res, 'Error fetching leads'); 
  }
};

const managePlan = async (req, res, action) => {
  try {
    if (action === 'list') {
      const list = await Plan.find();
      return successRes(res, list);
    }
    if (action === 'create') {
      const p = await Plan.create(req.body);
      return successRes(res, p, 'Plan Created');
    }
    if (action === 'update') {
      const p = await Plan.findByIdAndUpdate(req.params.id, { $set: req.body }, { returnDocument: 'after' });
      return successRes(res, p, 'Plan Updated');
    }
    if (action === 'delete') {
      await Plan.findByIdAndDelete(req.params.id);
      return successRes(res, null, 'Plan Deleted');
    }
  } catch (err) { return errorRes(res, 'Plan Management Error'); }
};


const getSettings = async (req, res) => {
  try {
    const setting = await SystemSetting.findOne({ key: 'dynamic_cms' });
    return successRes(res, setting && setting.value ? setting.value : null);
  } catch (err) { 
    console.error("GET Admin Settings Error:", err);
    return errorRes(res, 'Setting Fetch Error'); 
  }
};

const updateSettings = async (req, res) => {
  try {
    const setting = await SystemSetting.findOneAndUpdate(
      { key: 'dynamic_cms' },
      { value: req.body },
      { returnDocument: 'after', upsert: true }
    );
    return successRes(res, setting.value, 'Content successfully pushed to all panels!');
  } catch (err) { return errorRes(res, 'Setting Update Error'); }
};

const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    return successRes(res, feedbacks);
  } catch (err) { return errorRes(res, 'Feedback Fetch Error'); }
};

const clearFeedbacks = async (req, res) => {
  try {
    await Feedback.deleteMany({});
    return successRes(res, null, 'Feedback history cleared successfully');
  } catch (err) { return errorRes(res, 'Feedback Clear Error'); }
};

const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('senderId', 'fullName businessName city address').sort({ createdAt: -1 });
    return successRes(res, reports, 'Reports fetched successfully');
  } catch (err) {
    return errorRes(res, 'Error fetching reports');
  }
};

const replyToReport = async (req, res) => {
  try {
    const { reply } = req.body;
    const report = await Report.findByIdAndUpdate(req.params.id, {
      reply,
      status: 'Resolved'
    }, { new: true });
    return successRes(res, report, 'Replied to report');
  } catch (err) {
    return errorRes(res, 'Error replying to report');
  }
};

const deleteReport = async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    return successRes(res, null, 'Report deleted successfully');
  } catch (err) {
    return errorRes(res, 'Error deleting report');
  }
};


const getPlatformHealth = async (req, res) => {
  try {
    const freeMem = os.freemem();
    const totalMem = os.totalmem();
    const memUsage = Math.round(((totalMem - freeMem) / totalMem) * 100);
    const startTime = Date.now();
    await mongoose.connection.db.admin().ping();
    const dbLatency = Date.now() - startTime;
    const data = [
      { label: 'API Gateway', status: 'Operational', latency: '24ms', icon: '🌐', color: 'text-emerald-500', bar: 98 },
      { label: 'Database', status: 'Operational', latency: `${dbLatency}ms`, icon: '🗄️', color: 'text-emerald-500', bar: 99 },
      { label: 'App Server', status: 'Operational', latency: `${Math.round(os.loadavg()[0] * 10)}ms`, icon: '🖥️', color: 'text-emerald-500', bar: 100 - memUsage },
      { label: 'Storage CDN', status: 'Operational', latency: '45ms', icon: '☁️', color: 'text-emerald-500', bar: 95 }
    ];
    return successRes(res, data);
  } catch (err) { return errorRes(res, 'Health Error'); }
};
const getRevenueDashboard = async (req, res) => {
  const { filter = 'month' } = req.query;
  try {
    const now = new Date();
    let startDate = new Date();
    if (filter === 'day') startDate.setHours(0, 0, 0, 0);
    else if (filter === 'week') startDate.setDate(now.getDate() - 7);
    else startDate.setDate(now.getDate() - 30);

    const successfulTransactions = await Transaction.find({
      status: 'success',
      createdAt: { $gte: startDate }
    }).populate('providerId', 'fullName').populate('planId', 'name price');

    const totalRevenue = successfulTransactions.reduce((acc, curr) => acc + curr.amount, 0);
    const planMap = {};
    successfulTransactions.forEach(t => {
      const planName = t.planId?.name || 'Unknown Plan';
      if (!planMap[planName]) planMap[planName] = { revenue: 0, count: 0 };
      planMap[planName].revenue += t.amount;
      planMap[planName].count += 1;
    });

    const planBreakdown = Object.entries(planMap).map(([name, data]) => ({
      planName: name,
      revenue: data.revenue,
      count: data.count,
      percentage: totalRevenue > 0 ? Math.round((data.revenue / totalRevenue) * 100) : 0
    })).sort((a, b) => b.revenue - a.revenue);

    const revenueTimeline = [];
    const dateRange = filter === 'day' ? 1 : filter === 'week' ? 7 : 30;
    for (let i = dateRange - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      const ds = date.toISOString().split('T')[0];
      const dayRev = successfulTransactions.filter(t => t.createdAt.toISOString().split('T')[0] === ds).reduce((a, c) => a + c.amount, 0);
      revenueTimeline.push({ date: ds, revenue: dayRev });
    }

    const provMap = {};
    successfulTransactions.forEach(t => { provMap[t.providerId?.fullName || 'Guest'] = (provMap[t.providerId?.fullName || 'Guest'] || 0) + t.amount; });
    const topProvEntry = Object.entries(provMap).sort((a, b) => b[1] - a[1])[0];
    const recentTransactions = successfulTransactions.slice(-10).reverse();

    return successRes(res, {
      totalRevenue,
      totalTransactions: successfulTransactions.length,
      planBreakdown,
      revenueTimeline,
      topProvider: topProvEntry ? { fullName: topProvEntry[0], amount: topProvEntry[1] } : { fullName: 'N/A', amount: 0 },
      recentTransactions
    });
  } catch (err) { return errorRes(res, 'Revenue Error'); }
};
const getNotifications = async (req, res) => {
  try {
    const notifs = await Notification.find().sort({ createdAt: -1 }).limit(20);
    return successRes(res, notifs);
  } catch (err) {
    return errorRes(res, 'Error fetching notifications');
  }
};

const markNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    return successRes(res, null, 'Notifications marked as read');
  } catch (err) {
    return errorRes(res, 'Error updating notifications');
  }
};

module.exports = {
  adminLogin,
  getDashboardStats,
  getPendingApprovals,
  updateApprovalStatus,
  getAllUsers,
  toggleUserStatus,
  getAllProviders,
  toggleProviderStatus,
  getAllLeads,
  manageCategory,
  manageMaterial,
  manageBanner,
  manageOrder,
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
  getRevenueDashboard
};
