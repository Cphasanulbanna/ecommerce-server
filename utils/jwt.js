const jwt = require("jsonwebtoken");

const generateActivationToken = (user, secretKey) => {
    return jwt.sign(user, secretKey, {
        expiresIn: "5m",
    });
};

const generateJwtToken = (id) => {
    return jwt.sign({ _id: id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRY,
    });
};

const generateAccessToken = (userId, secretKey) => {
    return jwt.sign({ _id: userId }, secretKey, {
        expiresIn: process.env.JWT_EXPIRY,
    });
};

const generateRefreshToken = (userId, secretKey) => {
    return jwt.sign({ _id: userId }, secretKey, {
        expiresIn: process.env.JWT_EXPIRY,
    });
};

module.exports = {
    generateActivationToken,
    generateJwtToken,
    generateAccessToken,
    generateRefreshToken,
};
