const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  userName: {
    type: String
  },
  userPhone: {
    type: String
  },
  userAddress: {
    type: String
  },
  materialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material'
  },
  materialName: {
    type: String
  },
  brand: {
    type: String
  },
  unit: {
    type: String
  },
  quantity: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'shipped', 'delivered'],
    default: 'pending'
  },
  deliveryTime: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
