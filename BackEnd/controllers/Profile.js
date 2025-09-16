import bcrypt from "bcrypt";
import Profile from "../models/profile.js";

export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findByPk(req.user.id, {
      attributes: { exclude: ["Password"] },
    });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener perfil", error });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { Names, BirthDate, Email, Photo } = req.body;
    await Profile.update(
      { Names, BirthDate, Email, Photo },
      { where: { id: req.user.id } }
    );
    res.json({ message: "Perfil actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar perfil", error });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const profile = await Profile.findByPk(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, profile.Password);
    if (!isMatch)
      return res.status(400).json({ message: "Contraseña actual incorrecta" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    profile.Password = hashedPassword;
    await profile.save();

    res.json({ message: "Contraseña cambiada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al cambiar contraseña", error });
  }
};

export const requestDocumentChange = async (req, res) => {
  try {
    const { newType, newNumber } = req.body;
    // Aquí podrías guardar en una tabla de solicitudes
    res.json({
      message: "Solicitud de cambio de documento enviada",
      data: { newType, newNumber },
    });
  } catch (error) {
    res.status(500).json({ message: "Error al solicitar cambio de documento", error });
  }
};

export const changeDocumentAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newType, newNumber } = req.body;

    await Profile.update(
      { DocumentType: newType, DocumentNumber: newNumber },
      { where: { id: userId } }
    );

    res.json({ message: "Documento actualizado por administrador" });
  } catch (error) {
    res.status(500).json({ message: "Error al cambiar documento", error });
  }
};