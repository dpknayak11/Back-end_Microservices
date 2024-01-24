const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
    {
        mobile: {
            type: String,
            // unique: true
        },
        otp: {
            type: Number
        },
        email: {
            type: String,
            // unique: true

        },
        isPhoneVerified: {
            type: Boolean,
            default: false // Initially set to false
        }
    }
);

const loginUser = mongoose.model("loginUser", userSchema);

module.exports = loginUser;
