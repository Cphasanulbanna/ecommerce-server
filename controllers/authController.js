const path = require("path");
const fs = require("fs");

const User = require("../models/userModel");
const { generateActivationToken } = require("../utils/jwt");
const { sendMail } = require("../utils/sendMail");

exports.signup = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        const isUser = await User.findOne({ email });
        if (isUser) {
            const filename = req.file.filename;
            const filepath = `uploads/${filename}`;
            fs.unlink(filepath, (error) => {
                if (error) {
                    console.log(error.message);
                    res.status(500).json({ message: "Error deleting file" });
                } else {
                    res.json({ message: "File delted successfully" });
                }
            });
            return res.status(400).json({ message: "A user already exists with this email" });
        }

        const filename = req.file.filename;
        const fileUrl = path.join(filename);

        const user = {
            fullname: fullname,
            email: email,
            password: password,
            profilePic: fileUrl,
        };

        //activation

        const activationToken = generateActivationToken(user);
        const activationURL = `http://127.0.0.1:5173/auth/${activationToken}`;

        try {
            await sendMail({
                email: user.email,
                subject: "Activate your account",
                message: `Hello ${user.fullname}, please click on the linnk to activate your account: ${activationURL}`,
            });
            res.status(201).json({
                success: true,
                message: `Please check your email: ${user.email} to activate your account`,
            });
        } catch (error) {
            return res.status(500).json({ message: "Server error" });
        }

        const newUser = await User.create(user);

        res.status(201).json({ message: "signup success", newUser });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "server error" });
    }
};
