const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'senderModel'
  },
  senderModel: {
    type: String,
    required: true,
    enum: ['User', 'Provider']
  },
  message: {
    type: String,
    required: true
  },
  reply: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['Pending', 'Resolved'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
