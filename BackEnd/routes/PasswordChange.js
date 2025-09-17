const express = require("express");
const router = express.Router();
const changePassword = require("../controllers/PasswordChange");
const PasswordController = require("../controllers/PasswordController");

// Route for changing password from profile
router.put("/:userId/change-password", changePassword.changePassword);

// Routes for password reset (forgot password)
router.post("/send-code", PasswordController.sendResetCode);
router.post("/verify-code", PasswordController.verifyCode);
router.post("/reset-password", PasswordController.resetPassword);

module.exports = router;