const PasswordReset = require("../models/PasswordReset");
const db = require("../db");
const { sendPasswordResetEmail } = require("../services/emailService");

// --- Enviar código ---
const sendResetCode = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email requerido" });

  try {
    const [user] = await db.query("SELECT * FROM User WHERE Email = ?", [email]);
    if (user.length === 0) return res.status(404).json({ message: "Correo no registrado" });

    const code = Math.floor(1000 + Math.random() * 9000);
    await sendPasswordResetEmail(email, code);

    res.json({ message: "Código enviado al email" });
  } catch (error) {
    if (error.message.includes("Has alcanzado")) {
      return res.status(429).json({ message: error.message });
    }
    console.error("Error enviando código:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// --- Verificar código sin borrar ---
const verifyCode = async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ message: "Email y código requeridos" });

  try {
    const result = await PasswordReset.verifyCodeProcedure(email, code);
    if (!result.success) return res.status(400).json({ message: result.message });
    res.json({ message: "Código válido" });
  } catch (error) {
    console.error("Error verificando código:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// --- Resetear contraseña y borrar código usado ---
const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) return res.status(400).json({ message: "Todos los campos son requeridos" });

  try {
    const result = await PasswordReset.verifyCodeProcedure(email, code);
    if (!result.success) return res.status(400).json({ message: result.message });

    await PasswordReset.updatePassword(email, code, newPassword);
    res.json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.error("Error cambiando contraseña:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = { sendResetCode, verifyCode, resetPassword };