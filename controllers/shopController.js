const Shop = require("../models/shopModel");

const path = require("path");
const jwt = require("jsonwebtoken");

const { generatePasswordHash, comparePassword } = require("../utils/bcrypt");
const {
    generateActivationToken,
    generateAccessToken,
    generateRefreshToken,
    generateJwtToken,
} = require("../utils/jwt");
const { sendMail } = require("../utils/sendMail");

exports.createShop = async (req, res) => {
    try {
        const { email, password, shopname, address, phoneNumber, pincode } = req.body;
        const filename = req.file?.filename;
        const isSeller = await Shop.findOne({ email });

        if (isSeller) {
            return res
                .status(400)
                .json({ success: false, message: "A seller already exists with this email" });
        }

        const logoUrl = filename && path.join(filename);
        const passwordHash = await generatePasswordHash(password);

        const seller = {
            shopname: shopname,
            email: email,
            password: passwordHash,
            logo: logoUrl,
            address: address,
            phoneNumber: phoneNumber,
            pincode: pincode,
        };

        //activation
        const activationToken = generateActivationToken(seller, process.env.SHOP_ACTIVATION_SECRET);
        const activationURL = `http://localhost:5173/shop/activation/${activationToken}`;

        try {
            await sendMail({
                email: seller.email,
                subject: "Activate your shop",
                message: `please click on the link to activate your account: ${activationURL}`,
            });

            const response = {
                success: true,
                message: `Please check your email: ${seller.email} to activate your account`,
            };

            res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Server error" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
        console.log(error.message);
    }
};

exports.activateShop = async (req, res) => {
    try {
        const { activation_token } = req.body;
        const newSeller = jwt.verify(activation_token, process.env.SHOP_ACTIVATION_SECRET);

        if (!newSeller) {
            return res.status(400).json({ message: "Invalid token", success: false });
        }

        const { email, shopname, password, logo, address, phoneNumber, pincode } = newSeller;

        let seller = await Shop.findOne({ email });
        if (seller) {
            return res
                .status(400)
                .json({ success: false, message: "Seller already exists with this email" });
        }

        seller = await Shop.create({
            email,
            shopname,
            password,
            logo,
            address,
            phoneNumber,
            pincode,
        });

        const seller_activation_token = generateJwtToken(seller._id);

        //cookie options
        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: "none",
            secure: true,
        };
        res.cookie("seller_activation_token", seller_activation_token, options);

        res.status(201).json({
            message: "Seller account created",
            success: true,
            seller,
            seller_activation_token,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
        console.log(error.message);
    }
};

exports.loginShop = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "Username and password is required" });
        }

        const seller = await Shop.findOne({ email });
        if (!seller) {
            return res.status(404).json({ success: false, message: "Seller account not found" });
        }

        const isPasswordValid = await comparePassword(password, seller.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const accessToken = generateAccessToken(seller._id, process.env.SELLER_ACCESS_TOKEN_SECRET);
        const sellerRefreshToken = generateRefreshToken(
            seller._id,
            process.env.SELLER_REFRESH_TOKEN_SECRET
        );

        res.cookie("SellerRefreshToken", sellerRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        res.status(200).json({
            success: true,
            message: "Login success",
            accessToken: accessToken,
            id: seller._id,
            email: seller.email,
            name: seller.name,
            logo: seller.logo,
            address: seller.address,
            phoneNumber: seller.phoneNumber,
            pincode: seller.pincode,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error", success: false });
    }
};

exports.seller = async (req, res) => {
    try {
        const seller = await Shop.findById(req.sellerId).select("-password");
        if (!seller) {
            return res.status(404).json({ success: false, message: "Seller not found" });
        }
        res.status(200).json(seller);
    } catch (error) {
        res.status(500).json({ message: "Server Error", success: false });
        console.log(error.message, "error message****************");
    }
};
