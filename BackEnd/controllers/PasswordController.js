const db = require("../db");
const PasswordReset = require("../models/PasswordReset");
const nodemailer = require("nodemailer");
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
    if (user.length === 0) return res.status(404).json({ message: "Correo no registrado" });

    const code = Math.floor(1000 + Math.random() * 9000);
    await PasswordReset.createResetCode(email, code);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Código de recuperación de contraseña",
      html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container { 
          max-width: 600px; 
          margin: 20px auto; 
          background: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content { 
          padding: 40px 30px;
          background: white;
          text-align: center;
        }
        .code-box {
          background: #f8f9fa;
          border: 2px dashed #667eea;
          padding: 25px;
          margin: 30px 0;
          border-radius: 10px;
        }
        .code {
          font-size: 36px;
          font-weight: bold;
          color: #667eea;
          letter-spacing: 8px;
          font-family: 'Courier New', monospace;
        }
        .warning {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          text-align: left;
          border-radius: 4px;
          font-size: 14px;
        }
        .footer { 
          text-align: center; 
          padding: 20px 30px;
          background: #f8f9fa;
          color: #666; 
          font-size: 12px;
          border-top: 1px solid #e0e0e0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Recuperación de Contraseña</h1>
        </div>
        
        <div class="content">
          <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
          <p>Utiliza el siguiente código de verificación:</p>
          
          <div class="code-box">
            <div class="code">${code}</div>
          </div>
          
          <div class="warning">
            <strong>Importante:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Este código expira en 15 minutos</li>
              <li>Si no solicitaste este cambio, ignora este correo</li>
              <li>Nunca compartas este código con nadie</li>
            </ul>
          </div>
          
          <p style="color: #666; margin-top: 30px;">Si no solicitaste restablecer tu contraseña, puedes ignorar este mensaje de forma segura.</p>
        </div>
        
        <div class="footer">
          <p><strong>Happy-Art Eventos</strong> | ${new Date().getFullYear()}</p>
          <p>Este es un correo automático, por favor no responder.</p>
        </div>
      </div>
    </body>
    </html>
  `
    });

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