const PasswordReset = require("../models/PasswordReset");
const nodemailer = require("nodemailer");
const db = require("../db");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// --- Enviar código ---
const sendResetCode = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email requerido" });

  try {
    const [user] = await db.query("SELECT * FROM User WHERE Email = ?", [email]);
    if (user.length === 0) {
      return res.status(404).json({ message: "El correo no está registrado" });
    }

    const code = Math.floor(1000 + Math.random() * 9000);

    // Llama al procedimiento que valida el límite de 5 códigos por día
    await PasswordReset.createResetCode(email, code);

    // Envía el código por correo
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Código de recuperación",
      text: `Tu código es: ${code}`,
    });

    res.json({ message: "Código enviado al email" });
  } catch (error) {
    // Si el procedimiento lanza SIGNAL (cuando se pasa del límite)
    if (error.message.includes("Has alcanzado")) {
      return res.status(429).json({ message: error.message }); // 429 = Too Many Requests
    }
    console.error("Error enviando código:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// --- Verificar código ingresado por el usuario ---
const verifyCode = async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code)
    return res.status(400).json({ message: "Email y código requeridos" });

  try {
    const result = await PasswordReset.verifyCodeProcedure(email, code);
    if (!result.success) {
      return res.status(400).json({ message: result.message || "Código inválido o ya usado." });
    }

    res.json({ message: "Código verificado" });
  } catch (error) {
    console.error("Error verificando código:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};


const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword)
    return res.status(400).json({ message: "Todos los campos son requeridos" });

  try {
    // Verifica y borra el código antes de actualizar contraseña
    const result = await PasswordReset.verifyCodeProcedure(email, code);
    if (!result.success) {
      return res.status(400).json({ message: result.message || "Código inválido o ya usado." });
    }

    await PasswordReset.updatePassword(email, newPassword);
    res.json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.error("Error cambiando contraseña:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = { sendResetCode, verifyCode, resetPassword };
