const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  durationDays: {
    type: Number,
    required: true
  },
  tag: {
    type: String,
    default: 'Monthly'
  },
  color: {
    type: String,
    default: 'emerald'
  },
  features: [String],
  searchPriority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low'
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Plan', planSchema);
