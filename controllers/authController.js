const path = require("path");
const jwt = require("jsonwebtoken");

//models
const User = require("../models/userModel");

//utils
const {
    generateActivationToken,
    generateJwtToken,
    generateAccessToken,
    generateRefreshToken,
} = require("../utils/jwt");
const { sendMail } = require("../utils/sendMail");
const { comparePassword, generatePasswordHash } = require("../utils/bcrypt");

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
        const passwordHash = await generatePasswordHash(password);

        const user = {
            fullname: fullname,
            email: email,
            password: passwordHash,
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

        const token = generateJwtToken(user._id);

        //cookie options
        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: "none",
            secure: true,
        };
        res.cookie("token", token, options);

        res.status(200).json({
            success: true,
            user,
            token,
        });
    } catch (error) {
        res.status(500).json({ message: "server error", success: false });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "Username and password is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        res.status(200).json({
            success: true,
            message: "Login success",
            accessToken: accessToken,
            id: user._id,
            email: user.email,
            fullname: user.fullname,
            profilePic: user.profilePic,
            role: user.role,
            address: user.address,
            phoneNumber: user.phoneNumber,
        });
    } catch (error) {
        res.status(500).json({ message: "server error", success: false });
    }
};

exports.user = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user: user });
    } catch (error) {
        res.status(500).json({ message: "server error", success: false });
    }
};
