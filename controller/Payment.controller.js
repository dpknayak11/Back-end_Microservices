const Payment = require('../models/payment.model');
const User = require('../models/user.model');
const paymentService = require('../services/paymentService');

require("dotenv").config();

const RazorPaykeyId = process.env.RAZORPAY_KEY_ID;
const RazorPayKeySecret = process.env.RAZORPAY_KEY_SECRET;

const createPayment = async (req, res) => {
    const { amount, currency } = req.body;
    console.log("isAuth", req.user.id);

    try {
        const user = await User.findOne({ _id: req.user });

        if (!user) {
            return res.status(404).json({ error: 'Invalid or expired token' });
        }


        const paymentOrder = await paymentService.createPaymentOrder(amount, currency);

        // Save paymentOrder data to MongoDB using Mongoose
        const newPayment = new Payment({
            userId: user.id,
            amount: amount,
            currency: currency,
            status: paymentOrder.status
        });

        // Save the paymentOrder to the database
        const savedPayment = await newPayment.save();
        console.log("savedPayment : ", savedPayment);

        res.json({ savedPayment, paymentOrder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createPayment,
    // Other controller functions...
};

