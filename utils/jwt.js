const jwt = require("jsonwebtoken");

const generateActivationToken = async (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m",
    });
};

module.exports = { generateActivationToken };
