const { getProfileById, updateProfile } = require("../models/Profile");

// Obtener perfil
exports.getProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const profile = await getProfileById(userId);
    if (!profile) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el perfil: " + error.message });
  }
};

// Actualizar perfil
exports.updateProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const affectedRows = await updateProfile(userId, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Perfil actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el perfil: " + error.message });
  }
};