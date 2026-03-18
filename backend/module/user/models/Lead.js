const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true,
    index: true
  },
  clientName: {
    type: String
  },
  clientPhone: {
    type: String
  },
  projectType: {
    type: String,
    enum: ['Residential', 'Commercial', 'Industrial', 'Others'],
    default: 'Residential'
  },
  serviceType: {
    type: String
  },
  location: {
    type: String
  },
  description: {
    type: String
  },
  budget: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  rejectionReason: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lead', leadSchema);
