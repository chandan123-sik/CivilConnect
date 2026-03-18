const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  phone: {
    type: String
  },
  city: {
    type: String
  },
  location: {
    type: String
  },
  image: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Worker', workerSchema);
