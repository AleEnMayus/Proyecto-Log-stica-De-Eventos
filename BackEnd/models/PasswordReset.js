const db = require("../db");
const bcrypt = require("bcrypt");

const PasswordReset = {
  // Genera un nuevo código SOLO si no ha superado el límite diario
  createResetCode: async (email, code) => {
    // 1. Contar cuántos códigos ha generado hoy este email
    const [rows] = await db.query(
      `SELECT COUNT(*) AS total FROM PasswordReset 
       WHERE Email = ? AND DATE(CreatedAt) = CURDATE()`,
      [email]
    );

    if (rows[0].total >= 5) {
      throw new Error("Has alcanzado el límite de 5 códigos por hoy.");
    }

    // 2. Insertar un nuevo registro (no sobreescribimos, para poder contar bien)
    await db.query(
      `INSERT INTO PasswordReset (Email, Code, CreatedAt, Attempts)
       VALUES (?, ?, NOW(), 0)`,
      [email, code]
    );
  },

  // Llama al procedimiento almacenado en MySQL
  verifyCodeProcedure: async (email, code) => {
    return db.query("CALL VerifyResetCode(?, ?)", [email, code]);
  },

  // Actualiza contraseña y borra el registro de reset
  updatePassword: async (email, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query(`UPDATE User SET Password = ? WHERE Email = ?`, [
      hashedPassword,
      email,
    ]);
    await db.query(`DELETE FROM PasswordReset WHERE Email = ?`, [email]);
  },
};

module.exports = PasswordReset;
