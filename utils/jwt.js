const jwt = require("jsonwebtoken");

const generateActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m",
    });
};

const generateJwtToken = async (user, secretKey) => {
    const userId = user._id;
    return jwt.sign({ id: userId }, secretKey, {
        expiresIn: process.env.JWT_EXPIRY,
    });
};

module.exports = { generateActivationToken, generateJwtToken };
