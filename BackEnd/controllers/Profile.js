// controllers/profileController.js

// Asegúrate de que el nombre del archivo coincida (Profile.js)
const { getProfileById, updateProfile } = require("../models/Profile");

/**
 * Maneja la solicitud para obtener un perfil de usuario.
 */
exports.getProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const profile = await getProfileById(userId);
    if (!profile) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(profile);
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

/**
 * Maneja la solicitud para actualizar un perfil de usuario.
 */
exports.updateProfile = async (req, res) => {
  const { userId } = req.params;
  const dataToUpdate = req.body; // El cuerpo de la petición con los datos a cambiar

  try {
    // La lógica para no sobreescribir datos está en el modelo
    const affectedRows = await updateProfile(userId, dataToUpdate);
    
    if (affectedRows === 0) {
      // Puede significar que no se encontró el usuario o que no se enviaron datos para actualizar
      return res.status(404).json({ message: "Usuario no encontrado o no se proporcionaron datos para actualizar." });
    }
    
    res.status(200).json({ message: "Perfil actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};