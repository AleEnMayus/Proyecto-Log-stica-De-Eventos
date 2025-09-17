const PasswordReset = require("../models/PasswordReset");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Configurar Nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Enviar código
const sendResetCode = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email requerido" });

  try {
    const code = Math.floor(1000 + Math.random() * 9000);
    await PasswordReset.createResetCode(email, code);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Código de recuperación",
      text: `Tu código es: ${code}`,
    });

    res.json({ message: "Código enviado al email" });
  } catch (error) {
    console.error("❌ Error enviando código:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Verificar código
const verifyCode = async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code)
    return res.status(400).json({ message: "Email y código requeridos" });

  try {
    const record = await PasswordReset.verifyCode(email, code);
    if (!record) return res.status(400).json({ message: "Código inválido" });
    res.json({ message: "Código verificado" });
  } catch (error) {
    console.error("❌ Error verificando código:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Cambiar contraseña
const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword)
    return res.status(400).json({ message: "Todos los campos son requeridos" });

  try {
    const record = await PasswordReset.verifyCode(email, code);
    if (!record) return res.status(400).json({ message: "Código inválido" });

    await PasswordReset.updatePassword(email, newPassword);
    res.json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.error("❌ Error cambiando contraseña:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = { sendResetCode, verifyCode, resetPassword };