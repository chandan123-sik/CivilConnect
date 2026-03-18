const Lead = require('../models/Lead');
const User = require('../models/User');
const Provider = require('../../serviceprovider/models/Provider');
const { successRes, errorRes } = require('../../../utils/apiResponse');

const createLead = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const leadData = {
      ...req.body,
      userId: req.user.id,
      clientName: user?.fullName || 'Anonymous',
      clientPhone: user?.phone || 'N/A'
    };
    const lead = await Lead.create(leadData);
    return successRes(res, lead, 'Hiring request sent successfully', 201);
  } catch (err) { 
    console.error("Create Lead Error:", err);
    return errorRes(res, 'Error creating lead'); 
  }
};

const getUserLeads = async (req, res) => {
  try {
    const leads = await Lead.find({ userId: req.user.id }).populate('providerId', 'fullName profileImage category').sort({ createdAt: -1 });
    return successRes(res, leads);
  } catch (err) { return errorRes(res, 'Error'); }
};

const getProviderLeads = async (req, res) => {
  try {
    const leads = await Lead.find({ providerId: req.user.id })
      .populate('userId', 'fullName phone city area profileImage')
      .sort({ createdAt: -1 });

    // Enrich clientName and clientPhone from populated userId if missing
    const enriched = leads.map(lead => {
      const obj = lead.toObject();
      if (obj.userId) {
        obj.clientName = obj.clientName || obj.userId.fullName || 'Unknown User';
        obj.clientPhone = obj.clientPhone || obj.userId.phone || 'N/A';
        obj.clientCity = obj.userId.city || obj.location || 'N/A';
        obj.clientImage = obj.userId.profileImage || null;
      }
      return obj;
    });

    return successRes(res, enriched);
  } catch (err) { 
    console.error("Get Provider Leads Error:", err);
    return errorRes(res, 'Error fetching leads'); 
  }
};

const updateLeadStatus = async (req, res) => {
  const { status, rejectionReason } = req.body;
  try {
    const query = { _id: req.params.id };
    // If not admin, restrict to owner or provider
    if (req.user.role === 'provider') {
      query.providerId = req.user.id;
    } else if (req.user.role === 'user') {
      query.userId = req.user.id;
    }
    
    const lead = await Lead.findOne(query);
    if (!lead) return errorRes(res, 'Lead not found or unauthorized', 404);

    const oldStatus = lead.status;
    lead.status = status;
    if (rejectionReason) lead.rejectionReason = rejectionReason;
    await lead.save();

    // If status is completed and it wasn't completed before, increment provider's jobsDone count
    if (status === 'completed' && oldStatus !== 'completed' && lead.providerId) {
      await Provider.findByIdAndUpdate(lead.providerId, { $inc: { jobsDone: 1 } });
    }

    return successRes(res, lead, `Request ${status} successfully`);
  } catch (err) { 
    console.error("Update Lead Status Error:", err);
    return errorRes(res, 'Error updating status'); 
  }
};

const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('userId', 'fullName phone').populate('providerId', 'fullName phone category');
    if (!lead) return errorRes(res, 'Lead not found', 404);
    if (lead.userId._id.toString() !== req.user.id && lead.providerId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return errorRes(res, 'Unauthorized', 403);
    }
    return successRes(res, lead);
  } catch (err) { return errorRes(res, 'Error'); }
};

module.exports = {
  createLead,
  getUserLeads,
  getProviderLeads,
  updateLeadStatus,
  getLeadById
};
