const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Basic', 'Steel', 'Masonry', 'Flooring', 'Plumbing', 'Electrical', 'Finishing', 'Wood']
  },
  price: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  brands: [{
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quality: {
      type: String
    }
  }],
  status: {
    type: String,
    enum: ['Active', 'Pending', 'Inactive'],
    default: 'Active',
    index: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Material', materialSchema);
