const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const nodemailer = require("nodemailer");
const db = require("../../db"); // asegúrate de que este archivo exista y exporte la conexión

// === Configuración de Multer ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../uploads/contracts");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Solo se permiten archivos PDF"));
  },
});

// === Subir contrato y enviarlo al correo del cliente ===
router.post("/upload-pdf", upload.single("pdf"), async (req, res) => {
  try {
    const { eventId } = req.body;
    if (!eventId) {
      return res.status(400).json({ error: "Debe proporcionar el ID del evento" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No se subió ningún archivo" });
    }

    // Verificar si el evento existe
    const [existing] = await db.query(
      "SELECT e.ContractRoute, u.Email, u.FullName FROM Events e JOIN User u ON e.ClientId = u.UserId WHERE e.EventId = ?",
      [eventId]
    );

    if (!existing.length) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    if (existing[0].ContractRoute) {
      return res.status(400).json({
        error: "El contrato ya fue asignado a este evento. Solo se permite uno por evento.",
      });
    }

    // === Generar URL completa del contrato ===
    const serverUrl = process.env.SERVER_URL || "http://localhost:4000";
    const contractUrl = `${serverUrl}/uploads/contracts/${req.file.filename}`;
    const contractNumber = Math.floor(100000 + Math.random() * 900000);

    // === Guardar contrato (URL completa) en la tabla Events ===
    await db.query(
      `UPDATE Events 
       SET ContractRoute = ?, ContractNumber = ? 
       WHERE EventId = ?`,
      [contractUrl, contractNumber, eventId]
    );

    // === Enviar el contrato por correo al cliente ===
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tucorreo@gmail.com", // <-- cámbialo por tu correo
        pass: "tu_contraseña_de_aplicacion", // <-- usa contraseña de aplicación, no la normal
      },
    });

    const mailOptions = {
      from: "tucorreo@gmail.com",
      to: existing[0].Email,
      subject: `Contrato del evento #${contractNumber}`,
      text: `Hola ${existing[0].FullName},\n\nAdjuntamos el contrato correspondiente a su evento.\n\nSaludos,\nEquipo de Eventos`,
      attachments: [
        {
          filename: req.file.originalname,
          path: path.join(__dirname, "../../uploads/contracts", req.file.filename),
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Contrato subido, asociado y enviado correctamente al cliente",
      data: {
        eventId,
        contractUrl,
        contractNumber,
      },
    });
  } catch (error) {
    console.error(" Error al subir o enviar contrato:", error);
    res.status(500).json({ error: "Error interno al subir o enviar contrato" });
  }
});

module.exports = router;
