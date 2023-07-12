const path = require("path");
const fs = require("fs");

const User = require("../models/userModel");
const { generateActivationToken } = require("../utils/jwt");

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
        const activationURL = `http://127.0.0.1:5173/api/auth/${activationToken}`;

        const newUser = await User.create(user);

        if (!newUser) {
            const filename = req.file.filename;
            const filepath = `uploads/${filename}`;
            fs.unlink(filepath, (error) => {
                if (error) {
                    console.log(error.message);
                } else {
                    console.log("file deleted successfully");
                }
            });
        }

        res.status(201).json({ message: "signup success", newUser });
    } catch (error) {
        res.status(500).json({ message: "server error" });
        console.log(error.message);
    }
};
