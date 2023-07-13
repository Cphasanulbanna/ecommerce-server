const User = require("../models/userModel");

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
