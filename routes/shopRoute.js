const express = require("express");
const router = express.Router();

const { createShop } = require("../controllers/shopController");

router.post("/create-shop", createShop);

module.exports = router;
