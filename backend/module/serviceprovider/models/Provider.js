const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  fullName: {
    type: String,
    required: true
  },
  category: {
    type: String, // e.g., "Contractor"
    required: true
  },
  subCategory: {
    type: String
  },
  experience: {
    type: Number, // Years
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    index: true
  },
  about: {
    type: String
  },
  specialities: {
    type: [String],
    default: []
  },
  pricing: {
    type: String,
    default: "0"
  },
  city: {
    type: String
  },
  address: {
    type: String
  },
  profileImage: {
    type: String
  },
  workImage: {
    type: String
  },
  aadharImage: {
    type: String
  },
  policeVerifyImage: {
    type: String
  },
  recentWorkDesc: {
    type: String
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan'
  },
  subscriptionExpiry: {
    type: Date
  },
  lastTransactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  },
  role: {
    type: String,
    default: 'provider'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  jobsDone: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Provider', providerSchema);
