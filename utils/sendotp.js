
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const number = process.env.YOUR_TWILIO_PHONE_NUMBER;
const client = require('twilio')(accountSid, authToken);

// const otpGenerator = require('otp-generator');

function sendResetOTP(mobile, otp) {
    console.log("sendResetOTP", mobile, otp);
    client.messages
        .create({
            body: `Your OTP for verification is: ${otp}`,
            from: number,
            to: `+${mobile}` // Add the country code before the mobile number
        })
        .then(message => console.log(message.sid))
        .catch(err => console.error(err));
}


module.exports = sendResetOTP;

