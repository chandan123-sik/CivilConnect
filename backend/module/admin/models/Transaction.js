const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider',
        required: true,
        index: true
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        required: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    paymentMethod: {
        type: String,
        enum: ['UPI', 'Card', 'Net Banking', 'Cash', 'Razorpay'],
        default: 'UPI'
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'success' // Defaulting to success for dummy flow
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
