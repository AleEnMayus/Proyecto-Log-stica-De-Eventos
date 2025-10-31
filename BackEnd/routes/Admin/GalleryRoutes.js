const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../../db");

const router = express.Router();

/* =========================
  CONFIGURACIÓN DE MULTER
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/gallery/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* =========================  
PAGINACIÓN DE IMÁGENES POR ID
========================= */
router.get("/paginated", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const offset = (page - 1) * limit;

    // Contar total de imágenes
    const [countResult] = await db.query(
      "SELECT COUNT(*) AS total FROM MultimediaFile"
    );

    const totalImages = countResult[0].total;
    const totalPages = Math.ceil(totalImages / limit);

    // Obtener las imágenes paginadas
    const [images] = await db.query(
      `SELECT FileId, FileName, FilePath, Extension
       FROM MultimediaFile
       ORDER BY FileId DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    // Formatear respuesta
    const formattedImages = images.map((img) => ({
      FileId: img.FileId,
      FileName: img.FileName,
      url: `http://localhost:4000/uploads/${img.FilePath}`,
      Extension: img.Extension,
    }));

    res.json({
      page,
      limit,
      totalPages,
      totalImages,
      images: formattedImages,
    });
  } catch (err) {
    console.error("Error en la paginación de imágenes:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

/* =========================
  SUBIR FOTO
========================= */
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { file } = req;
    if (!file) return res.status(400).json({ error: "No se envió ningún archivo" });

    const extension = path.extname(file.originalname).toUpperCase().replace(".", "");
    const fileName = file.filename;
    const filePath = file.path.replace(/\\/g, "/");

    await db.query(
      "INSERT INTO MultimediaFile (FileName, FilePath, Extension) VALUES (?, ?, ?)",
      [fileName, filePath, extension]
    );

    res.status(201).json({ message: "Archivo subido correctamente", fileName });
  } catch (err) {
    console.error("Error al subir archivo:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

/* =========================
  OBTENER TODAS LAS FOTOS
========================= */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT FileId, FileName, FilePath, Extension FROM MultimediaFile ORDER BY FileId DESC"
    );

    const host = req.get("host");
    const protocol = req.protocol;

    const files = rows.map((r) => {
      const filePathNormalized = (r.FilePath || "").replace(/\\/g, "/");
      const url = `${protocol}://${host}/${filePathNormalized}`;
      return { ...r, url };
    });

    res.json(files);
  } catch (err) {
    console.error("Error al listar archivos:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

/* =========================
  OBTENER COMENTARIOS DE UNA IMAGEN
========================= */
router.get("/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const [comments] = await db.query(
      `SELECT c.CommentId, c.CommentText, c.PublicationDate, u.Names as UserName
       FROM Comments c
       LEFT JOIN User u ON c.UserId = u.UserId
       WHERE c.MultimediaFileId = ? AND c.CommentStatus = 'selected'
       ORDER BY c.PublicationDate DESC`,
      [id]
    );
    res.json(comments);
  } catch (err) {
    console.error("Error al obtener comentarios:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

/* =========================
  OBTENER COMENTARIOS PÚBLICOS (PENDING)
========================= */
router.get("/comments/public", async (req, res) => {
  try {
    const [comments] = await db.query(
      `SELECT 
         CommentId, 
         CommentText, 
         CommentStatus,
         MultimediaFileId
       FROM Comments
       WHERE CommentStatus = 'pending'
       ORDER BY PublicationDate DESC`
    );
    res.json(comments);
  } catch (err) {
    console.error("Error al obtener comentarios públicos:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

/* =========================
  AGREGAR COMENTARIO A UNA IMAGEN
========================= */
router.post("/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const { commentId } = req.body;

    await db.query(
      `UPDATE Comments 
       SET MultimediaFileId = ?, CommentStatus = 'selected' 
       WHERE CommentId = ?`,
      [id, commentId]
    );

    res.json({ message: "Comentario agregado correctamente" });
  } catch (err) {
    console.error("Error al agregar comentario:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

/* =========================
  REMOVER COMENTARIO DE UNA IMAGEN
========================= */
router.delete("/:id/comments/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;

    await db.query(
      `UPDATE Comments 
       SET MultimediaFileId = NULL, CommentStatus = 'pending' 
       WHERE CommentId = ?`,
      [commentId]
    );

    res.json({ message: "Comentario removido correctamente" });
  } catch (err) {
    console.error("Error al remover comentario:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

/* =========================
  OBTENER FOTO POR ID
========================= */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      "SELECT FileId, FileName, FilePath, Extension FROM MultimediaFile WHERE FileId = ?",
      [id]
    );

    if (!rows.length) return res.status(404).json({ error: "Archivo no encontrado" });

    const r = rows[0];
    const filePathNormalized = (r.FilePath || "").replace(/\\/g, "/");
    const host = req.get("host");
    const protocol = req.protocol;
    const url = `${protocol}://${host}/${filePathNormalized}`;

    res.json({
      FileId: r.FileId,
      FileName: r.FileName,
      FilePath: r.FilePath,
      Extension: r.Extension,
      url,
    });
  } catch (err) {
    console.error("Error al obtener archivo por id:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

/* =========================
  ELIMINAR FOTO POR ID
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT FilePath FROM MultimediaFile WHERE FileId = ?", [id]);

    if (!rows.length) return res.status(404).json({ error: "Archivo no encontrado" });

    const filePath = rows[0].FilePath;

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await db.query("DELETE FROM MultimediaFile WHERE FileId = ?", [id]);

    res.json({ message: "Archivo eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar archivo:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

/* =========================
  ELIMINAR TODAS LAS FOTOS
========================= */
router.delete("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT FilePath FROM MultimediaFile");

    for (const row of rows) {
      if (fs.existsSync(row.FilePath)) {
        fs.unlinkSync(row.FilePath);
      }
    }

    await db.query("UPDATE Comments SET MultimediaFileId = NULL WHERE MultimediaFileId IS NOT NULL");
    await db.query("DELETE FROM MultimediaFile");
    await db.query("ALTER TABLE MultimediaFile AUTO_INCREMENT = 1");

    res.json({ message: "Todos los archivos fueron eliminados" });
  } catch (err) {
    console.error("Error al eliminar todos los archivos:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
