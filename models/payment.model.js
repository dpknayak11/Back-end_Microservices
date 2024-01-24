const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
        enum: ['USD', 'EUR', 'INR', 'otherPossibleCurrencies'],
    },
    status: {
        type: String,
        required: true,
    }
    // Other payment-related fields...
});

module.exports = mongoose.model('Payment', paymentSchema);