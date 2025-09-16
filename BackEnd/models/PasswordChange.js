// models/PasswordChange.js
const pool = require("../db"); // usar require si tu db.js exporta con module.exports

const getUserById = async (idUsuario) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT * FROM Usuario WHERE IdUsuario = ?",
      [idUsuario]
    );
    return rows[0];
  } finally {
    connection.release();
  }
};

const updatePassword = async (idUsuario, newPasswordHash) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      "UPDATE Usuario SET Contraseña = ? WHERE IdUsuario = ?",
      [newPasswordHash, idUsuario]
    );
    return result;
  } finally {
    connection.release(); // ⚡ corregido
  }
};

module.exports = { getUserById, updatePassword };