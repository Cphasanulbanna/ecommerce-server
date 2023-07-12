const path = require("path");
const User = require("../models/userModel");

exports.signup = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        const isUser = await User.findOne({ email });
        if (isUser)
            return res.status(400).json({ message: "A user already exists with this email" });

        const filename = req.file.filename;
        const fileUrl = path.join(filename);

        const user = {
            fullname: fullname,
            email: email,
            password: password,
            profilePic: fileUrl,
        };

        console.log(user, "user");

        res.status(201).json({ message: "signup success", user });
    } catch (error) {
        res.status(500).json({ message: "server error" });
        console.log(error.message);
    }
};
