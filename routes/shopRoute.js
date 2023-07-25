const express = require("express");
const router = express.Router();

const { createShop } = require("../controllers/shopController");

const { upload } = require("../middlewares/upload");

router.post("/create-shop", upload.single("logo"), createShop);
router.post("/activate-shop");

module.exports = router;
