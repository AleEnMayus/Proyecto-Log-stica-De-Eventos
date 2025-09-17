const db = require("../db");
const bcrypt = require("bcrypt");

const PasswordReset = {
  createResetCode: async (email, code) => {
    await db.query(
      `INSERT INTO PasswordReset (Email, Code, CreatedAt)
       VALUES (?, ?, NOW())
       ON DUPLICATE KEY UPDATE Code = ?, CreatedAt = NOW()`,
      [email, code, code]
    );
  },

  verifyCode: async (email, code) => {
    const [rows] = await db.query(
      `SELECT * FROM PasswordReset WHERE Email = ? AND Code = ?`,
      [email, code]
    );
    return rows[0];
  },

  updatePassword: async (email, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query(`UPDATE User SET Password = ? WHERE Email = ?`, [hashedPassword, email]);
    await db.query(`DELETE FROM PasswordReset WHERE Email = ?`, [email]);
  },
};

module.exports = PasswordReset;