const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const { generateActivationToken, generateJwtToken } = require("../utils/jwt");
const { sendMail } = require("../utils/sendMail");

exports.signup = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        const filename = req.file?.filename;

        const isUser = await User.findOne({ email });
        if (isUser) {
            return res
                .status(400)
                .json({ success: false, message: "A user already exists with this email" });
        }

        const imageURL = filename && path.join(filename);

        const user = {
            fullname: fullname,
            email: email,
            password: password,
            profilePic: imageURL && imageURL,
        };

        //activation
        const activationToken = generateActivationToken(user);
        const activationURL = `http://127.0.0.1:5173/auth/activation/${activationToken}`;

        try {
            await sendMail({
                email: user.email,
                subject: "Activate your account",
                message: `Hello ${user.fullname}, please click on the linnk to activate your account: ${activationURL}`,
            });
            res.status(200).json({
                success: true,
                message: `Please check your email: ${user.email} to activate your account`,
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "server error " });
    }
};

exports.activateAccount = async (req, res) => {
    try {
        const { activation_token } = req.body;
        const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

        if (!newUser) {
            return res.status(400).json({ message: "Invalid token", success: false });
        }

        const { email, fullname, password, profilePic } = newUser;

        let user = await User.findOne({ email });
        if (user) {
            return res
                .status(400)
                .json({ success: false, message: "User already exists with this email" });
        }

        user = await User.create({ email, fullname, password, profilePic });

        const token = await generateJwtToken(user, process.env.JWT_SECRET_KEY);

        //cookie options
        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: "none",
            secure: true,
        };

        res.status(200).cookie("token", token, options).json({
            success: true,
            user,
            token,
        });
    } catch (error) {
        res.status(500).json({ message: "server error", success: false });
    }
};
