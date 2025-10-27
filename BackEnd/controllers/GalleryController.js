// controllers/commentsController.js
import pool from "../db.js";

export const getCommentsByMedia = async (req, res) => {
  const { multimediaId } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT c.CommentId, c.CommentText, c.CommentStatus, c.PublicationDate, c.UserId, u.Names AS UserName, u.Photo
       FROM Comments c
       LEFT JOIN User u ON c.UserId = u.UserId
       WHERE c.MultimediaFileId = ?
       ORDER BY c.PublicationDate DESC`,
      [multimediaId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener comentarios" });
  }
};

export const getCommentById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT c.CommentId, c.CommentText, c.CommentStatus, c.PublicationDate, c.UserId, u.Names AS UserName
       FROM Comments c
       LEFT JOIN User u ON c.UserId = u.UserId
       WHERE c.CommentId = ?`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: "Comentario no encontrado" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener comentario" });
  }
};

export const addComment = async (req, res) => {
  /**
   * Body esperado:
   * {
   *   multimediaId: INT | null,
   *   userId: INT,
   *   text: "..."
   * }
   */
  const { multimediaId = null, userId, text } = req.body;
  if (!userId || !text || !text.trim()) return res.status(400).json({ error: "Faltan datos requeridos" });

  try {
    const [result] = await pool.query(
      `INSERT INTO Comments (CommentText, CommentStatus, PublicationDate, UserId, MultimediaFileId)
       VALUES (?, 'pending', NOW(), ?, ?)`,
      [text.trim(), userId, multimediaId]
    );
    const insertId = result.insertId;
    const [rows] = await pool.query(
      `SELECT c.CommentId, c.CommentText, c.CommentStatus, c.PublicationDate, c.UserId, u.Names AS UserName
       FROM Comments c
       LEFT JOIN User u ON c.UserId = u.UserId
       WHERE c.CommentId = ?`,
      [insertId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al agregar comentario" });
  }
};

export const selectComment = async (req, res) => {
  const { id } = req.params;
  try {
    // actualizar a 'selected'
    await pool.query("UPDATE Comments SET CommentStatus = 'selected' WHERE CommentId = ?", [id]);
    res.json({ message: "Comentario marcado como seleccionado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al seleccionar comentario" });
  }
};

export const rejectComment = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("UPDATE Comments SET CommentStatus = 'rejected' WHERE CommentId = ?", [id]);
    res.json({ message: "Comentario rechazado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al rechazar comentario" });
  }
};
