const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
    shopname: {
        type: String,
        required: [true, "Please enter your full name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your full email"],
    },
    password: {
        type: String,
        required: [true, "Please enter your full password"],
        minLenght: [4, "Password should be greater than 4 characters"],
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    pincode: {
        type: Number,
        required: true,
        min: 6,
        max: 6,
    },
    logo: {
        type: String,
        default: "",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Shop", shopSchema);
