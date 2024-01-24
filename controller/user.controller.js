
const jwt = require('jsonwebtoken');
const express = require('express')
const User = require('../models/user.model');
const LoginUser = require('../models/loginuser.model');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const number = process.env.YOUR_TWILIO_WHATSAPP_NUMBER;
const client = require('twilio')(accountSid, authToken);

const { isAuth, generateToken, generateResetToken } = require("../middleware/authenticate");
const { sendResetEmail, sendResetOTP, sendEmailOTP } = require('../utils/resetPassword.util')

const bcrypt = require("bcryptjs");

function generateOTP() {
    // return otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
    const otp = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
    return otp.toString(); // Converts the OTP to a string
};

const getAllUser = async (req, res) => {
    const users = await User.find({});
    res.send(users);
}

//1.
const loginMobileOTP = async (req, res) => {
    const { mobile } = req.body;

    try {
        if (!mobile) {
            return res.status(422).json({ error: "Please provide a mobile number" });
        }

        const existingUser = await User.findOne({ mobile });

        if (existingUser) {
            return res.status(422).json({ error: "This mobile number already exists" });
        }

        const otp = generateOTP(); // Implement your function to generate an OTP

        if (!otp) {
            return res.status(500).json({ error: "OTP generation failed" });
        }

        // const old = await LoginUser.findOne({ mobile });
        // if(old){
        //  return res.status(500).json({ error: "This mobile number already exists"});
        // }

        const newUser = new LoginUser({ mobile, otp });
        const storedUser = await newUser.save();

        if (!storedUser) {
            return res.status(500).json({ error: "Error saving user" });
        }

        // Assuming 'sendResetOTP' function handles OTP sending asynchronously
        await sendResetOTP(mobile, otp);
        res.status(201).json(storedUser);
        console.log("Mobile, OTP: ", mobile, otp);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};


const loginEmailOTP = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(422).json({ error: "Please provide an email!" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(422).json({ error: "This email already exists" });
        }

        const otp = generateOTP(); // Implement your function to generate an OTP
        if (!otp) {
            return res.status(500).json({ error: "OTP generation failed" });
        }

        const newUser = new LoginUser({ email, otp });
        console.log(newUser,"...........");

        const storedUser = await newUser.save();
        console.log(storedUser,"...........");

        if (!storedUser) {
            return res.status(500).json({ error: "Error saving user" });
        }

        // Assuming 'sendEmailOTP' function handles OTP sending asynchronously
        await sendEmailOTP(email, otp);

        console.log("New User: ", storedUser);
        console.log("Email, OTP: ", email, otp);

        res.status(201).json(storedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

//2.
const mobileVerifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;

        if (!otp) {
            return res.status(400).json({ error: 'Please provide both mobile number and OTP' });
        }

        // Find the user by phone number and OTP
        const newUser = await LoginUser.findOne({ otp });
        const oldUser = await User.findOne({ otp });

        if (newUser) {
            // Mark OTP as verified (or perform additional actions as needed)
            newUser.isPhoneVerified = true;
            await newUser.save();
            return res.status(200).json({ message: 'Phone number verified successfully!' });
        }

        else if (oldUser) {
            const token = generateToken(oldUser);
            res.set('Authorization', `Bearer ${token}`);

            oldUser.otp = undefined;
            await oldUser.save();
            res.status(200).json({ message: 'Phone number verified successfully!' });
            console.log("token : ", token)
        }
        else {
            return res.status(400).json({ error: 'Invalid OTP or phone number' });
        }

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

const emailVerifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;

        if (!otp) {
            return res.status(400).json({ error: 'Please provide both email and OTP' });
        }

        // Find the user by phone number and OTP
        const newUser = await LoginUser.findOne({ otp });
        const oldUser = await User.findOne({ otp });

        if (newUser) {
            // Mark OTP as verified (or perform additional actions as needed)
            newUser.isPhoneVerified = true;
            await newUser.save();
            return res.status(200).json({ message: 'email verified successfully!' });
        }

        else if (oldUser) {
            const token = generateToken(oldUser);
            res.set('Authorization', `Bearer ${token}`);

            oldUser.otp = undefined;
            await oldUser.save();
            res.status(200).json({ message: 'email verified successfully!' });
            console.log("token : ", token)
        }
        else {
            return res.status(400).json({ error: 'Invalid OTP or email' });
        }

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

//3. 
const signUp = async (req, res) => {
    const { name, email, mobile, password, cpassword } = req.body;

    try {
        if (!name || !email || !mobile || !password || !cpassword) {
            return res.status(422).json({ error: "Fill in all the details" });
        }

        const existingEmailUser = await User.findOne({ email });

        if (existingEmailUser) {
            return res.status(422).json({ error: "This email is already in use" });
        }

        if (password !== cpassword) {
            return res.status(422).json({ error: "Passwords do not match" });
        }

        const loginUser = await LoginUser.findOne({ mobile });
        if (!loginUser || loginUser.mobile !== mobile) {
            return res.status(422).json({ error: "Mobile number chnage !" });
        }
        if (loginUser.isPhoneVerified !== true) {
            return res.status(422).json({ error: "Mobile number verification failed !" });
        }

        const hashedPassword = bcrypt.hashSync(password, 8);

        const newUser = new User({
            name,
            email,
            mobile,
            password: hashedPassword
        });

        const storedUser = await newUser.save();
        res.status(201).json(storedUser);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};


const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ error: "Please provide both email and password" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = generateToken(user);
        res.set('Authorization', `Bearer ${token}`);
        res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
                // Add other necessary user details
            },
            token
        });

    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}


const logoutUser = async (req, res) => {
    try {
        // Clear the token from the cookie
        //res.clearCookie("eccomerce", { path: "/" });
        res.set('Authorization', '');
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error during logout:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}


const forgetpasswordEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        else {
            const resetToken = generateResetToken(user);
            user.resetToken = resetToken;
            await user.save();
            // const resetLink = `http://localhost:5000/api/user/resetpasswordEmail/${resetToken}`;


            const resetLink = `<h3>Hi! We got the request from you for reset the password. Here is the link below >>></h3>
            <a href="http://localhost:${process.env.PORT}/api/user/resetpasswordEmail/${resetToken}"> <h2>Click Here</h2></a>`;


            await sendResetEmail(email, resetLink);
            console.log("link : ", resetLink)
            return res.status(200).json(resetLink);
        }
    } catch (error) {
        console.error('Error sending reset email:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


const forgetpasswordMobile = async (req, res) => {
    const { mobile } = req.body;

    try {
        const user = await User.findOne({ mobile: mobile });
        const otp = generateOTP(); // Implement your function to generate an OTP


        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        else if (!otp) {
            return res.status(500).json({ error: "OTP generation failed" });
        }
        else {
            await sendResetOTP(mobile, otp);
            user.otp = otp;
            await user.save();
            return res.status(200).json({ message: 'OTP generation send !' });
        }
    } catch (error) {
        console.error('Error sending reset email:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


const resetpasswordEmail = async (req, res) => {
    const { token } = req.params;
    const { password, cpassword } = req.body;

    try {
        const user = await User.findOne({ resetToken: token });

        if (!user) {
            return res.status(404).json({ error: 'Invalid or expired token' });
        }

        else if (password !== cpassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }
        else {
            const pswd = bcrypt.hashSync(password, 8);
            user.password = pswd;
            user.resetToken = undefined;
            await user.save();
            return res.status(200).json({ message: 'Password reset successful' });
        }
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


const chnagePassword = async (req, res) => {
    const { password, cpassword } = req.body;
    try {
        const user = await User.findOne({ _id: req.user });

        if (!user) {
            return res.status(404).json({ error: 'Invalid or expired token' });
        }

        else if (password !== cpassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }
        else {
            const pswd = bcrypt.hashSync(password, 8);
            user.password = pswd;
            user.otp = undefined;
            await user.save();
            return res.status(200).json({ message: 'Password reset successful' });
        }
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const test1 = (req, res) => {
    res.send('This is the test route! page ');
}

const sendWhatsAppMessage = async (req, res) =>{
    const {clientNumber} = req.body;
    try {
        const message = await client.messages.create({
            body: 'Your appointment is coming up on July 21 at 3PM',
            from: number,
            to: `whatsapp:+${clientNumber}`
        });

        console.log(message.sid);
        return res.status(200).json({ message: 'WhatsApp Msg send successfully!' });
    } catch (error) {
        console.error('Error sending WhatsApp message:', error.message);
    }
}


module.exports = {
    getAllUser,
    signUp,
    signIn,
    logoutUser,
    loginMobileOTP,
    mobileVerifyOTP,
    emailVerifyOTP,
    forgetpasswordEmail,
    resetpasswordEmail,
    forgetpasswordMobile,
    chnagePassword,
    loginEmailOTP,
    sendWhatsAppMessage,
    test1
}