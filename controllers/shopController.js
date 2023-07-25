const Shop = require("../models/shopModel");

const path = require("path");
const { generatePasswordHash } = require("../utils/bcrypt");
const { generateActivationToken } = require("../utils/jwt");

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
        const activationToken = generateActivationToken(seller);
        const activationURL = `http://127.0.0.1:5173/auth/activation/${activationToken}`;

        try {
            await sendMail({
                email: user.email,
                subject: "Activate your shop",
                message: `please click on the link to activate your account: ${activationURL}`,
            });
            res.status(200).json({
                success: true,
                message: `Please check your email: ${seller.email} to activate your account`,
            });
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
        const newSeller = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

        if (!newSeller) {
            return res.status(400).json({ message: "Invalid token", success: false });
        }

        const { email, shopname, password, logo, address, phoneNumber, pincode } = newUser;

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

        const token = generateJwtToken(seller._id);

        //cookie options
        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: "none",
            secure: true,
        };
        res.cookie("token", token, options);

        res.status(200).json({
            success: true,
            user,
            token,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
        console.log(error.message);
    }
};
