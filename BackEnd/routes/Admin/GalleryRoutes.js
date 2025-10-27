import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Obtener todos los comentarios
router.get("/", (req, res) => {
  db.query("SELECT * FROM Comments", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Agregar un comentario nuevo
router.post("/", (req, res) => {
  const { CommentText, UserId, MultimediaFileId } = req.body;
  const sql = "INSERT INTO Comments (CommentText, UserId, MultimediaFileId) VALUES (?, ?, ?)";
  db.query(sql, [CommentText, UserId, MultimediaFileId || null], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Comentario agregado correctamente", CommentId: result.insertId });
  });
});

// Actualizar estado de comentario (publicar o rechazar)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const sql = "UPDATE Comments SET CommentStatus = ? WHERE CommentId = ?";
  db.query(sql, [status, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: `Comentario actualizado a ${status}` });
  });
});

export default router;
