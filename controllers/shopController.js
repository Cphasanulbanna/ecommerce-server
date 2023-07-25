const Shop = require("../models/shopModel");

exports.createShop = async (req, res) => {
    try {
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
        console.log(error.message);
    }
};
