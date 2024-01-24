const nodemailer = require("nodemailer");
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const number = process.env.YOUR_TWILIO_PHONE_NUMBER;
const client = require('twilio')(accountSid, authToken);


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


async function sendResetEmail(recipientEmail, resetLink) {
    try {
        const transporter = nodemailer.createTransport({
            // Specify your email service provider and credentials here
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: process.env.your_email,
                pass: process.env.your_SMPT_password
            }
        });

        const mailOptions = {
            from: process.env.your_email,
            to: recipientEmail,
            subject: 'Password Reset',
            html: `<p>Click the link below to reset your password:</p><p>${resetLink}</p>`
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        // console.log('Reset email sent successfully: ', transporter, mailOptions);
    } catch (error) {
        console.error('Error sending reset email:', error);
        throw new Error('Failed to send reset email');
    }
};

async function sendEmailOTP(email, otp) {
    try {
        const transporter = nodemailer.createTransport({
            // Specify your email service provider and credentials here
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: process.env.your_email,
                pass: process.env.your_SMPT_password
            }
        });

        const mailOptions = {
            from: process.env.your_email,
            to: email,
            subject: 'Password Reset',
            html: `Your OTP for verification is: ${otp}`
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        // console.log('Reset email sent successfully: ', transporter, mailOptions);
    } catch (error) {
        console.error('Error sending reset email:', error);
        throw new Error('Failed to send reset email');
    }
};


module.exports = {
    sendResetEmail,
    sendResetOTP, sendEmailOTP
}