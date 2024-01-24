const Razorpay = require("razorpay");
require("dotenv").config();

const RazorPaykeyId = process.env.RAZORPAY_KEY_ID;
const RazorPayKeySecret = process.env.RAZORPAY_KEY_SECRET;

const razorpay = new Razorpay({
    key_id: RazorPaykeyId,
    key_secret: RazorPayKeySecret,
});

const createPaymentOrder = async (amount, currency) => {
    const options = {
        amount: amount * 100,
        currency: currency,
        receipt: 'receipt_order_123', // Replace with your receipt ID logic
    };

    try {
        const response = await razorpay.orders.create(options);
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    createPaymentOrder,
    // Other payment-related functions...
};
