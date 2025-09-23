const db = require("../db");
const bcrypt = require("bcrypt");

const PasswordReset = {
  // Crear código de recuperación (máximo 5 por día)
  createResetCode: async (email, code) => {
    try {
      await db.query("CALL CreatePasswordResetCode(?, ?)", [email, code]);
    } catch (error) {
      if (error.sqlState === "45000") {
        throw new Error(error.sqlMessage);
      }
      throw error;
    }
  },

  // Verifica solo si el código es válido (sin borrar)
  verifyCodeProcedure: async (email, code) => {
    try {
      await db.query("CALL CheckResetCode(?, ?)", [email, code]);
      return { success: true };
    } catch (error) {
      if (error.sqlState === "45000") return { success: false, message: error.sqlMessage };
      throw error;
    }
  },

  // Actualiza contraseña y borra el código usado
  updatePassword: async (email, code, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query(`UPDATE User SET Password = ? WHERE Email = ?`, [
      hashedPassword,
      email,
    ]);

    // Borra el código que se acaba de usar
    await db.query(`DELETE FROM PasswordReset WHERE Email = ? AND Code = ?`, [email, code]);
  },
};

module.exports = PasswordReset;