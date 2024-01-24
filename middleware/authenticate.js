const User = require('../models/user.model');
const jwt = require("jsonwebtoken");
let secret = "abc";

const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user._id
        },
        secret,
        {
            expiresIn: "30d",
        }
    );
};

const generateResetToken = (user) => {
    return jwt.sign(
        {
            email: user.email
        },
        secret,
        {
            expiresIn: "30d",
        }
    );
};

const isAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    try {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }
        console.log("authHeader: ", authHeader)
        const token = authHeader.split(' ')[1];
        console.log("token split : ", token);

        if (!token) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        const verifiedToken = jwt.verify(token, secret);

        if (!verifiedToken || !verifiedToken.userId) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        // Check if the user exists based on the decoded token
        const user = await User.findById(verifiedToken.userId);

        if (!user) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }

        // Attach the user object to the request for further usage
        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
};

module.exports = { isAuth, generateToken, generateResetToken };

