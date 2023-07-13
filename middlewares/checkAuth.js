const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const checkAuth = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ success: false, message: "Access denied" });
        }
        token = token.split(" ")[1];

        const isTokenValid = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userId = isTokenValid._id;

        const user = await User.findById(req.userId);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "Access denied: User not found" });
        }

        next();
    } catch (error) {
        console.log(error);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Access denied: Invalid token" });
        }
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = { checkAuth };
