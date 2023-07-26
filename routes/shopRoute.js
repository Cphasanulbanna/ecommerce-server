const express = require("express");
const router = express.Router();

const { createShop, activateShop, loginShop } = require("../controllers/shopController");

const { upload } = require("../middlewares/upload");

router.post("/create-shop", upload.single("logo"), createShop);
router.post("/activation", activateShop);
router.post("/login", loginShop);

module.exports = router;
