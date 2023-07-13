const express = require("express");
const router = express.Router();

const { user } = require("../controllers/userController");

const { checkAuth } = require("../middlewares/checkAuth");

router.get("/", checkAuth, user);

module.exports = router;
