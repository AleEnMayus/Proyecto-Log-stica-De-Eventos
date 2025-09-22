const PasswordReset = require("../models/PasswordReset");
const nodemailer = require("nodemailer");
const db = require("../db");
require("dotenv").config();

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Enviar código de recuperación
const sendResetCode = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email requerido" });

  try {
    // Validar que el correo exista
    const [user] = await db.query("SELECT * FROM User WHERE Email = ?", [email]);
    if (user.length === 0) {
      return res.status(404).json({ message: "El correo no está registrado" });
    }

    // Generar y guardar el código
    const code = Math.floor(1000 + Math.random() * 9000);

    await PasswordReset.createResetCode(email, code);

    // Enviar correo
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Código de recuperación",
      text: `Tu código es: ${code}`,
    });

    res.json({ message: "Código enviado al email" });
  } catch (error) {
    if (error.sqlState === "45000") {
      return res.status(429).json({ message: error.sqlMessage }); // Límite alcanzado
    }
    console.error("Error enviando código:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Verificar código ingresado por el usuario
const verifyCode = async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code)
    return res.status(400).json({ message: "Email y código requeridos" });

  try {
    const record = await PasswordReset.verifyCode(email, code);
    if (!record) return res.status(400).json({ message: "Código inválido" });

    res.json({ message: "Código verificado" });
  } catch (error) {
    console.error("Error verificando código:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Cambiar contraseña del usuario
const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword)
    return res.status(400).json({ message: "Todos los campos son requeridos" });

  try {
    // Verificar el código antes de actualizar la contraseña
    const record = await PasswordReset.verifyCode(email, code);
    if (!record) return res.status(400).json({ message: "Código inválido" });

    // Actualizar contraseña y borrar registros
    await PasswordReset.updatePassword(email, newPassword);

    res.json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.error("Error cambiando contraseña:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = { sendResetCode, verifyCode, resetPassword };
