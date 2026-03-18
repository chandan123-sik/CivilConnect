const mongoose = require('mongoose');

const systemSettingSchema = new mongoose.Schema({
  key: {
    type: String, // e.g., 'privacy_policy' or 'dynamic_cms'
    required: true,
    unique: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed, // flexible json structure for policyPoints, etc.
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('SystemSetting', systemSettingSchema);
