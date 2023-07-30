const express = require("express");
const router = express.Router();

const { createShop, activateShop, loginShop, seller } = require("../controllers/shopController");

const { upload } = require("../middlewares/upload");

router.post("/create-shop", upload.single("logo"), createShop);
router.post("/activation", activateShop);
router.post("/login", loginShop);
router.get("/seller", seller);

module.exports = router;
