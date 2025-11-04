const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../../db");
const nodemailer = require("nodemailer");

// Configuración de almacenamiento para PDFs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../uploads/contracts");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB máximo
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Solo se permiten archivos PDF"));
  },
});

router.get("/by-client/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;

    const [rows] = await db.query(
      `SELECT 
        EventId, 
        EventName, 
        ContractRoute, 
        ContractNumber,
        EventDateTime,
        EventStatus
      FROM Events 
      WHERE ClientId = ?
      ORDER BY EventDateTime DESC`,
      [clientId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener contratos del cliente:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
// =======================
// SUBIR O REEMPLAZAR CONTRATO
// =======================
router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const { eventId } = req.body;
    if (!eventId) return res.status(400).json({ error: "Falta el ID del evento" });
    if (!req.file) return res.status(400).json({ error: "No se recibió ningún archivo" });

    const contractPath = `/uploads/contracts/${req.file.filename}`;
    const contractNumber = Math.floor(100000 + Math.random() * 900000);

    // Verificar si ya existe un contrato
    const [[existing]] = await db.query(
      "SELECT ContractRoute FROM Events WHERE EventId = ?",
      [eventId]
    );

    // Si existe contrato anterior, eliminar el archivo físico
    if (existing && existing.ContractRoute) {
      const oldFilePath = path.join(__dirname, "../../", existing.ContractRoute);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
        console.log("Contrato anterior eliminado:", oldFilePath);
      }
    }

    // Actualizar o crear contrato
    await db.query(
      `UPDATE Events SET ContractRoute = ?, ContractNumber = ? WHERE EventId = ?`,
      [contractPath, contractNumber, eventId]
    );

    // Obtener correo del cliente
    const [[eventData]] = await db.query(
      `SELECT e.EventName, u.Email, u.Names 
       FROM Events e
       INNER JOIN User u ON e.ClientId = u.UserId
       WHERE e.EventId = ?`,
      [eventId]
    );

    if (!eventData) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    // Enviar correo
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const accion = existing && existing.ContractRoute ? "actualizado" : "asignado";

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: eventData.Email,
        subject: `Contrato ${accion} para tu evento: ${eventData.EventName}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
            <h2 style="color: #2c3e50;">Hola ${eventData.Names},</h2>
            <p>Se ha ${accion} un contrato para tu evento <strong>${eventData.EventName}</strong>.</p>
            <p><strong>Número de contrato:</strong> ${contractNumber}</p>
            <p>El contrato se adjunta en este correo.</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            <p style="color: #7f8c8d; font-size: 12px;">Este es un correo automático, por favor no respondas a este mensaje.</p>
          </div>
        `,
        attachments: [{ 
          filename: `Contrato_${eventData.EventName}.pdf`,
          path: path.join(__dirname, "../../uploads/contracts", req.file.filename) 
        }],
      });
    } catch (mailError) {
      console.warn("Error al enviar correo:", mailError.message);
    }

    const mensaje = existing && existing.ContractRoute 
      ? "Contrato reemplazado y enviado correctamente"
      : "Contrato subido y enviado correctamente";

    res.json({
      message: mensaje,
      data: { 
        contractNumber, 
        emailSentTo: eventData.Email,
        replaced: !!(existing && existing.ContractRoute)
      },
    });
  } catch (error) {
    console.error("Error al subir contrato:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// =======================
// LISTAR TODOS LOS CONTRATOS
// =======================
router.get("/list", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        e.EventId, 
        e.EventName, 
        e.ContractRoute, 
        e.ContractNumber,
        e.EventDateTime,
        e.EventStatus,
        u.Names AS ClientName,
        u.Email AS ClientEmail
      FROM Events e
      INNER JOIN User u ON e.ClientId = u.UserId
      WHERE e.ContractRoute IS NOT NULL
      ORDER BY e.EventDateTime DESC`
    );

    res.json(rows);
  } catch (error) {
    console.error("Error al listar contratos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// =======================
// OBTENER CONTRATO POR EVENTO
// =======================
router.get("/by-event/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const [rows] = await db.query(
      "SELECT ContractRoute, ContractNumber FROM Events WHERE EventId = ?",
      [eventId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No se encontró el evento" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener contrato:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// =======================
// DESCARGAR CONTRATO
// =======================
router.get("/download/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const [[event]] = await db.query(
      "SELECT ContractRoute, EventName FROM Events WHERE EventId = ?",
      [eventId]
    );

    if (!event || !event.ContractRoute) {
      return res.status(404).json({ message: "No hay contrato disponible" });
    }

    const filePath = path.join(__dirname, "../../", event.ContractRoute);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Archivo no encontrado en el servidor" });
    }

    res.download(filePath, `Contrato_${event.EventName}.pdf`);
  } catch (error) {
    console.error("Error al descargar contrato:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// =======================
// ELIMINAR CONTRATO
// =======================
router.delete("/delete/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const [[event]] = await db.query(
      "SELECT ContractRoute FROM Events WHERE EventId = ?",
      [eventId]
    );

    if (!event || !event.ContractRoute) {
      return res.status(404).json({ message: "No hay contrato que eliminar" });
    }

    const filePath = path.join(__dirname, "../../", event.ContractRoute);

    // Eliminar archivo físico si existe
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Limpiar campos en la base de datos
    await db.query(
      "UPDATE Events SET ContractRoute = NULL, ContractNumber = NULL WHERE EventId = ?",
      [eventId]
    );

    res.json({ message: "Contrato eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar contrato:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// =======================
// REENVIAR CONTRATO POR CORREO
// =======================
router.post("/send-email/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;

    const [[eventData]] = await db.query(
      `SELECT 
        e.EventName, 
        e.ContractRoute, 
        e.ContractNumber,
        u.Email, 
        u.Names
      FROM Events e
      INNER JOIN User u ON e.ClientId = u.UserId
      WHERE e.EventId = ?`,
      [eventId]
    );

    if (!eventData) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    if (!eventData.ContractRoute) {
      return res.status(404).json({ error: "No hay contrato disponible para este evento" });
    }

    const filePath = path.join(__dirname, "../../", eventData.ContractRoute);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Archivo del contrato no encontrado en el servidor" });
    }

    // Enviar correo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: eventData.Email,
      subject: `Contrato para tu evento: ${eventData.EventName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #2c3e50;">Hola ${eventData.Names},</h2>
          <p>Te enviamos nuevamente el contrato para tu evento <strong>${eventData.EventName}</strong>.</p>
          <p><strong>Número de contrato:</strong> ${eventData.ContractNumber}</p>
          <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #7f8c8d; font-size: 12px;">Este es un correo automático, por favor no respondas a este mensaje.</p>
        </div>
      `,
      attachments: [{
        filename: `Contrato_${eventData.EventName}.pdf`,
        path: filePath
      }],
    });

    res.json({
      message: "Correo enviado exitosamente",
      emailSentTo: eventData.Email
    });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    res.status(500).json({ error: "Error al enviar el correo: " + error.message });
  }
});

module.exports = router;