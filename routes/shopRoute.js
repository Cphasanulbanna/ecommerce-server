const express = require("express");
const router = express.Router();

const { createShop, activateShop } = require("../controllers/shopController");

const { upload } = require("../middlewares/upload");

router.post("/create-shop", upload.single("logo"), createShop);
router.post("/activate-shop", activateShop);

module.exports = router;
