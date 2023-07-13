const express = require("express");
const router = express.Router();

const { signup, activateAccount, login } = require("../controllers/authController");
const { upload } = require("../middlewares/upload");

router.post("/signup", upload.single("profile_pic"), signup);
router.post("/activation", activateAccount);
router.post("/login", login);

module.exports = router;
