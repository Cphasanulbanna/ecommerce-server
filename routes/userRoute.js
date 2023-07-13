const express = require("express");
const router = express.Router();

const { user } = require("../controllers/authController");

router.get("/", user);

module.exports = router;
