// models/UserProfile.js
const db = require("../db");

// Obtener perfil por UserId
async function getProfileById(userId) {
  const [rows] = await db.query(
    `SELECT UserId, Names, DocumentType, DocumentNumber, BirthDate, Email, Status, Role, Photo
     FROM User
     WHERE UserId = ?`,
    [userId]
  );
  return rows.length > 0 ? rows[0] : null;
}

// Actualizar perfil
async function updateProfile(userId, data) {
  const { Names, BirthDate, Email, Status, Role, Photo } = data;

  // Validación opcional de enums
  const validStatus = ['active', 'inactive'];
  const validRoles = ['user', 'admin'];

  if (Status && !validStatus.includes(Status)) {
    throw new Error("Estado inválido");
  }
  if (Role && !validRoles.includes(Role)) {
    throw new Error("Rol inválido");
  }

  const [result] = await db.query(
    `UPDATE User
     SET Names = ?, BirthDate = ?, Email = ?, Status = ?, Role = ?, Photo = ?
     WHERE UserId = ?`,
    [Names, BirthDate, Email, Status, Role, Photo, userId]
  );
  return result.affectedRows; // devuelve 1 si se actualizó correctamente
}

module.exports = { getProfileById, updateProfile };