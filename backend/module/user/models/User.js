const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  fullName: {
    type: String
  },
  email: {
    type: String
  },
  city: {
    type: String
  },
  area: {
    type: String
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  profileImage: {
    type: String
  },
  role: {
    type: String,
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
