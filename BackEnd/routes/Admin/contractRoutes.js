const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pool = require("../db");

const router = express.Router();

// Configuración Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/contracts/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

function fileFilter(req, file, cb) {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Solo se permiten archivos PDF"), false);
}

const upload = multer({ storage, fileFilter });

/**
 * 📤 Subir contrato PDF y guardarlo en evento
 */
router.post("/upload-contract/:eventId", upload.single("pdf"), async (req, res) => {
  try {
    const { eventId } = req.params;

    // Guardar ruta en BD
    const [result] = await pool.query(
      "UPDATE Events SET ContractRoute = ?, ContractNumber = ? WHERE EventId = ?",
      [req.file.path, Date.now(), eventId] // ContractNumber simple: timestamp
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    res.json({
      message: "Contrato subido correctamente",
      file: req.file
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 📋 Obtener lista de contratos con cliente y evento
 */
router.get("/contracts", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.EventId, e.EventName, e.ContractNumber, e.ContractRoute, u.UserName AS ClientName
      FROM Events e
      JOIN User u ON e.ClientId = u.UserId
      WHERE e.ContractRoute IS NOT NULL
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ⬇ Descargar contrato por EventId
 */
router.get("/contracts/:eventId/download", async (req, res) => {
  try {
    const { eventId } = req.params;
    const [rows] = await pool.query(
      "SELECT ContractRoute FROM Events WHERE EventId = ?",
      [eventId]
    );

    if (rows.length === 0 || !rows[0].ContractRoute) {
      return res.status(404).json({ error: "Contrato no encontrado" });
    }

    res.download(rows[0].ContractRoute);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ❌ Borrar contrato (ruta y en disco)
 */
router.delete("/contracts/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;

    const [rows] = await pool.query(
      "SELECT ContractRoute FROM Events WHERE EventId = ?",
      [eventId]
    );

    if (rows.length === 0 || !rows[0].ContractRoute) {
      return res.status(404).json({ error: "Contrato no encontrado" });
    }

    const filePath = rows[0].ContractRoute;

    // Borrar archivo físico
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // Limpiar ruta en BD
    await pool.query(
      "UPDATE Events SET ContractRoute = NULL, ContractNumber = NULL WHERE EventId = ?",
      [eventId]
    );

    res.json({ message: "Contrato eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
