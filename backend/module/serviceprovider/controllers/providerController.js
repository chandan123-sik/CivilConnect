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
    const Razorpay = require('razorpay');
    const Provider = require('../models/Provider');
    const Plan = require('../../admin/models/Plan');

    let provider;
    if (req.user.id && req.user.id !== 'new-user') {
        provider = await Provider.findById(req.user.id);
    }
    
    if (!provider && req.user.phone) {
        provider = await Provider.findOne({ phone: req.user.phone });
    }

    if (!provider) return errorRes(res, 'Provider context not found. Please complete profile.', 404);

    const plan = await Plan.findById(planId);
    if (!plan) return errorRes(res, 'Plan not found', 404);

    let order;
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: Math.round(plan.price * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        order = await instance.orders.create(options);
    } catch (rzpErr) {
        console.warn("Razorpay Order Creation Skip:", rzpErr.message);
        // Fallback for dev/missing keys
        order = { id: `order_dummy_${Date.now()}`, amount: Math.round(plan.price * 100), currency: "INR" };
    }

    return successRes(res, {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      providerName: provider.fullName,
      providerEmail: provider.email || 'support@civilconnect.com',
      providerPhone: provider.phone,
      planName: plan.name
    }, 'Razorpay order created');
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    return errorRes(res, 'Failed to initiate payment. Please check your credentials.');
  }
};

const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId, isDummy } = req.body;
  const crypto = require("crypto");

  try {
    const Provider = require('../models/Provider');
    const Plan = require('../../admin/models/Plan');
    const Transaction = require('../../admin/models/Transaction');
    const Notification = require('../../admin/models/Notification');

    // 1. Verify Signature (Skip if isDummy for development)
    if (!isDummy) {
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return errorRes(res, 'Invalid Payment Signature', 400);
      }
    }

    // 2. Clear Database Updates
    let provider;
    if (req.user.id && req.user.id !== 'new-user') {
        provider = await Provider.findById(req.user.id);
    }
    
    if (!provider && req.user.phone) {
        provider = await Provider.findOne({ phone: req.user.phone });
    }

    const plan = await Plan.findById(planId);

    if (!provider || !plan) return errorRes(res, 'Entity not found. Please ensure profile is complete.', 404);

    // Create a real Transaction record
    const transaction = await Transaction.create({
      providerId: provider._id,
      planId: plan._id,
      transactionId: razorpay_payment_id,
      amount: plan.price,
      paymentMethod: req.body.paymentMethod || 'Razorpay',
      status: 'success'
    });

    // Calculate expiry date
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + (plan.durationDays || 30));

    // Update provider status
    provider.approvalStatus = 'pending';
    provider.subscriptionId = planId;
    provider.subscriptionExpiry = expiry;
    provider.lastTransactionId = transaction._id;
    await provider.save();

    // Notify Admin
    await Notification.create({
      title: 'New Paid Subscription',
      message: `${provider.fullName} has paid ₹${plan.price} for ${plan.name} via Razorpay.`,
      type: 'Approval',
      relatedId: provider._id
    });

    return successRes(res, { transactionId: razorpay_payment_id, provider }, 'Payment Verified & Subscription Pending Admin Approval.');
  } catch (error) {
    console.error("Signature Verification Error:", error);
    return errorRes(res, error.message || 'Payment verification failed', 500);
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
  initiateSubscription,
  verifyPayment
};
