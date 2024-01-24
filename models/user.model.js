const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keysecret = "token"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      // required: true,
    },
    resetToken: {
      type: String,
    },
    otp: {
      type: Number,
    }
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
