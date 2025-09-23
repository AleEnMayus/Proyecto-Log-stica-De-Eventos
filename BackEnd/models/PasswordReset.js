const db = require("../db");
const bcrypt = require("bcrypt");

const PasswordReset = {
  // Genera un nuevo código usando el procedimiento (máximo 5 por día)
  createResetCode: async (email, code) => {
    try {
      await db.query("CALL CreatePasswordResetCode(?, ?)", [email, code]);
    } catch (error) {
      if (error.sqlState === "45000") {
        // <- Error personalizado desde MySQL
        throw new Error(error.sqlMessage);
      }
      throw error;
    }
  },


  // Verifica y elimina el código en un solo paso
  verifyCodeProcedure: async (email, code) => {
    try {
      await db.query("CALL VerifyResetCode(?, ?)", [email, code]);
      return true;
    } catch (error) {
      if (error.sqlState === "45000") return false;
      throw error;
    }
  },

  // Actualiza contraseña y borra todos los códigos de ese email (por seguridad)
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
