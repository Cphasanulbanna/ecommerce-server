const jwt = require("jsonwebtoken");

const generateActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m",
    });
};

const generateJwtToken = (userId) => {
    return jwt.sign({ _id: userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRY,
    });
};

const generateAccessToken = (userId) => {
    return jwt.sign({ _id: userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
    });
};

const generateRefreshToken = (userId) => {
    return jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
    });
};

module.exports = {
    generateActivationToken,
    generateJwtToken,
    generateAccessToken,
    generateRefreshToken,
};
