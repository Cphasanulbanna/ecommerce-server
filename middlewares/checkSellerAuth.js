const jwt = require("jsonwebtoken");
const Shop = require("../models/shopModel");

const checkSellerAuth = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ success: false, message: "Access denied" });
        }
        token = token.split(" ")[1];

        const isTokenValid = jwt.verify(token, process.env.SELLER_ACCESS_TOKEN_SECRET);
        req.sellerId = isTokenValid._id;

        const seller = await Shop.findById(req.sellerId);
        if (!seller) {
            return res
                .status(404)
                .json({ success: false, message: "Access denied: Seller not found" });
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

module.exports = { checkSellerAuth };
