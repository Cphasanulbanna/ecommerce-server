const express = require("express");
const router = express.Router();

const { signup } = require("../controllers/authController");
const { upload } = require("../middlewares/upload");

router.post("/signup", upload.single("profile_pic"), signup);

module.exports = router;
