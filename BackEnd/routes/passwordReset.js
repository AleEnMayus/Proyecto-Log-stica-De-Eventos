const express = require("express");
const router = express.Router();
const PasswordController = require("../controllers/PasswordController");

router.post("/send-code", PasswordController.sendResetCode);
router.post("/verify-code", PasswordController.verifyCode);
router.post("/reset-password", PasswordController.resetPassword);

module.exports = router;