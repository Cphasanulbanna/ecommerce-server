const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullname: {
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
        select: false,
    },
    phoneNumber: {
        type: Number,
    },
    address: [
        {
            country: {
                type: String,
            },
            city: {
                type: String,
            },
            address1: {
                type: String,
            },
            address2: {
                type: String,
            },
            zipCode: {
                type: Number,
            },
            addressType: {
                type: String,
            },
        },
    ],
    role: {
        type: String,
        default: "user",
    },
    // profilePic: {
    //     public_id: {
    //         type: String,
    //         required: true,
    //     },
    //     url: {
    //         type: String,
    //         required: true,
    //     },
    // },
    profilePic: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    resetPasswordToken: String,
    resetPasswordTime: Date,
});

module.exports = mongoose.model("User", userSchema);
