// controllers/PasswordController.js
const bcrypt = require("bcrypt");
const PasswordChange = require("../models/PasswordChange");

const changePassword = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both passwords are required" });
    }

    const user = await PasswordChange.getUserById(idUsuario);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.Contraseña);
    if (!isMatch) return res.status(401).json({ message: "Current password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    await PasswordChange.updatePassword(idUsuario, newPasswordHash);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating password", error: error.message });
  }
};

module.exports = { changePassword };