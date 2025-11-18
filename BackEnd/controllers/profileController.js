const path = require("path");
const fs = require("fs");
const db = require("../db");

// ===============================
// OBTENER FOTO DE PERFIL
// ===============================
exports.getProfileImage = async (req, res) => {
  try {
    const { UserId } = req.params;
    if (!UserId) return res.status(400).json({ error: "UserId es requerido" });

    const [rows] = await db.query("SELECT Photo FROM User WHERE UserId = ?", [UserId]);
    if (!rows.length || !rows[0].Photo) {
      return res.status(404).json({ error: "No se encontró imagen de perfil" });
    }

    const photoPath = rows[0].Photo.replace(/\\/g, "/");
    const url = `${req.protocol}://localhost:4000/${photoPath}`;

    return res.json({ url });
  } catch (err) {
    console.error("Error en getProfileImage:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ===============================
// SUBIR / ACTUALIZAR FOTO DE PERFIL
// ===============================
exports.uploadImage = async (req, res) => {
  try {
    const { file } = req;
    const { UserId } = req.params;

    if (!file) return res.status(400).json({ error: "No se envió ningún archivo" });
    if (!UserId) {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      return res.status(400).json({ error: "UserId es requerido en la ruta" });
    }

    const filePath = file.path.replace(/\\/g, "/");
    const fileUrl = `${req.protocol}://localhost:4000/${filePath}`;

    // Verificar existencia del usuario
    const [rows] = await db.query("SELECT Photo FROM User WHERE UserId = ?", [UserId]);
    if (!rows.length) {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const previousPhoto = rows[0].Photo;

    // Actualizar la ruta en la base de datos
    await db.query("UPDATE User SET Photo = ? WHERE UserId = ?", [filePath, UserId]);

    // Intentar eliminar la foto anterior
    if (previousPhoto) {
      try {
        let prevPath = previousPhoto.replace(/\\/g, "/");
        if (/^https?:\/\//i.test(prevPath)) {
          const idx = prevPath.indexOf("uploads/");
          if (idx !== -1) prevPath = prevPath.substring(idx);
        }

        if (prevPath.includes("uploads")) {
          const fullPath = path.resolve(prevPath);
          if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        }
      } catch (e) {
        console.warn("No se pudo eliminar la foto previa:", e.message || e);
      }
    }

    return res.status(201).json({
      message: "Imagen subida correctamente",
      url: fileUrl,
      path: filePath,
    });
  } catch (err) {
    console.error("Error en uploadImage:", err);

    // Si hay archivo subido pero ocurre error, eliminarlo
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.warn("No se pudo limpiar archivo temporal:", e.message || e);
      }
    }

    res.status(500).json({ error: "Error interno del servidor" });
  }
};