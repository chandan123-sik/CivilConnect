const Provider = require('../models/Provider');
const Worker = require('../models/Worker');
// Foreign Module Imports
const Lead = require('../../user/models/Lead');
const Feedback = require('../../admin/models/Feedback');
const Report = require('../../admin/models/Report');
const { successRes, errorRes } = require('../../../utils/apiResponse');

// @desc    Onboard new provider
const createProviderProfile = async (req, res) => {
  const { fullName, category, subCategory, experience, about, specialities, pricing, city, address, recentWorkDesc } = req.body;
  const phone = req.user.phone; 

  try {
    const providerData = {
      fullName, category, subCategory, experience, about, 
      specialities: specialities ? specialities.split(',').map(s => s.trim()) : [],
      pricing, city, address, recentWorkDesc,
      profileImage: req.files?.profileImage ? req.files.profileImage[0].path : undefined,
      workImage: req.files?.workImage ? req.files.workImage[0].path : undefined,
      aadharImage: req.files?.aadharImage ? req.files.aadharImage[0].path : undefined,
      policeVerifyImage: req.files?.policeVerifyImage ? req.files.policeVerifyImage[0].path : undefined,
    };

    let provider = await Provider.findOneAndUpdate({ phone }, { $set: providerData }, { returnDocument: 'after', upsert: true });

    const generateToken = require('../../../utils/generateToken');
    const token = generateToken(provider._id, 'provider');

    return successRes(res, { provider, token }, 'Provider onboarding initiated. Pending Admin approval.');
  } catch (error) {
    console.error(error);
    return errorRes(res, 'Error creating provider profile');
  }
};

const getProviderProfile = async (req, res) => {
  try {
    const provider = await Provider.findById(req.user.id);
    return successRes(res, provider);
  } catch (error) { return errorRes(res, 'Error'); }
};

const updateProviderProfile = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Handle specialities string to array
    if (updateData.specialities && typeof updateData.specialities === 'string') {
      updateData.specialities = updateData.specialities.split(',').map(s => s.trim());
    }

    // Handle multiple file uploads
    if (req.files) {
      if (req.files.profileImage) updateData.profileImage = req.files.profileImage[0].path;
      if (req.files.workImage) updateData.workImage = req.files.workImage[0].path;
      if (req.files.aadharImage) updateData.aadharImage = req.files.aadharImage[0].path;
      if (req.files.policeVerifyImage) updateData.policeVerifyImage = req.files.policeVerifyImage[0].path;
    }

    const provider = await Provider.findByIdAndUpdate(req.user.id, { $set: updateData }, { returnDocument: 'after' });
    return successRes(res, provider, 'Profile updated');
  } catch (error) { 
    console.error("Update Provider Error:", error);
    return errorRes(res, 'Update failed'); 
  }
};

const toggleOnlineStatus = async (req, res) => {
  const { isOnline } = req.body;
  try {
    const provider = await Provider.findByIdAndUpdate(req.user.id, { isOnline }, { returnDocument: 'after' });
    return successRes(res, { isOnline: provider.isOnline }, `Status set to ${isOnline ? 'Online' : 'Offline'}`);
  } catch (error) { return errorRes(res, 'Failed'); }
};

const getProviderDashboard = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments({ providerId: req.user.id });
    const pendingLeads = await Lead.countDocuments({ providerId: req.user.id, status: 'pending' });
    const workersCount = await Worker.countDocuments({ providerId: req.user.id });
    return successRes(res, { totalLeads, pendingLeads, workersCount });
  } catch (error) { return errorRes(res, 'Error'); }
};

// --- WORKER MANAGEMENT ---
const getWorkers = async (req, res) => {
  try {
    const workers = await Worker.find({ providerId: req.user.id });
    return successRes(res, workers);
  } catch (error) { return errorRes(res, 'Error'); }
};

const addWorker = async (req, res) => {
  try {
    const workerData = { ...req.body, providerId: req.user.id };
    if (req.file) workerData.image = req.file.path;
    const worker = await Worker.create(workerData);
    return successRes(res, worker, 'Worker added successfully');
  } catch (error) { return errorRes(res, 'Failed'); }
};

const updateWorker = async (req, res) => {
  try {
    const workerData = { ...req.body };
    if (req.file) workerData.image = req.file.path;
    const worker = await Worker.findByIdAndUpdate(req.params.id, { $set: workerData }, { returnDocument: 'after' });
    return successRes(res, worker, 'Worker updated');
  } catch (error) { return errorRes(res, 'Update failed'); }
};

const deleteWorker = async (req, res) => {
  try {
    await Worker.findByIdAndDelete(req.params.id);
    return successRes(res, null, 'Worker deleted');
  } catch (error) { return errorRes(res, 'Delete failed'); }
};

const submitFeedback = async (req, res) => {
  try {
    const provider = await Provider.findById(req.user.id);
    const feedback = await Feedback.create({
      name: provider.fullName || provider.businessName || 'Unknown Provider',
      role: 'Provider',
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
      senderModel: 'Provider',
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

const initiateSubscription = async (req, res) => {
  const { planId } = req.body;
  try {
    const provider = await Provider.findById(req.user.id);
    if (!provider) return errorRes(res, 'Provider not found');

    const Plan = require('../../admin/models/Plan');
    const Notification = require('../../admin/models/Notification');
    const Transaction = require('../../admin/models/Transaction');
    
    const plan = await Plan.findById(planId);
    if (!plan) return errorRes(res, 'Plan not found');

    // Create a dummy Transaction record to "feel real"
    const dummyTransactionId = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const transaction = await Transaction.create({
        providerId: provider._id,
        planId: plan._id,
        transactionId: dummyTransactionId,
        amount: plan.price,
        paymentMethod: req.body.paymentMethod || 'UPI',
        status: 'success'
    });

    // Update provider status to pending and set subscriptionId
    provider.approvalStatus = 'pending';
    provider.subscriptionId = planId;
    provider.lastTransactionId = transaction._id;
    await provider.save();

    // Create notification for Admin
    await Notification.create({
      title: 'New Plan Subscription',
      message: `${provider.fullName} has subscribed to ${plan.name}. Transaction ID: ${dummyTransactionId}`,
      type: 'Approval',
      relatedId: provider._id
    });

    return successRes(res, { provider, transactionId: dummyTransactionId }, 'Payment Successful. Waiting for Admin Approval.');
  } catch (error) {
    console.error("Initiate Subscription Error:", error);
    return errorRes(res, 'Subscription initiation failed');
  }
};

module.exports = {
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
  initiateSubscription
};
