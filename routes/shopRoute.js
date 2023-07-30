const express = require("express");
const router = express.Router();

const { createShop, activateShop, loginShop, seller } = require("../controllers/shopController");

const { upload } = require("../middlewares/upload");

const { checkSellerAuth } = require("../middlewares/checkSellerAuth");

router.post("/create-shop", upload.single("logo"), createShop);
router.post("/activation", activateShop);
router.post("/login", loginShop);
router.get("/seller", checkSellerAuth, seller);

module.exports = router;
