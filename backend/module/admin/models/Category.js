const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    unique: true
  },
  icon: {
    type: String
  },
  color: {
    type: String, // bg-emerald-50
    default: 'bg-emerald-50'
  }   ,
  accent: {
    type: String, // text-emerald-600
    default: 'text-emerald-600'
  },
  subCategories: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending Review'],
    default: 'Active',
    index: true
  },
  activeProviders: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
