const db = require("../db");
const bcrypt = require("bcrypt");

const Account = {
  // Crear usuario con contraseña hasheada
  create: async ({ Names, DocumentType, DocumentNumber, BirthDate, Email, Password, Status = "active", Role = "user" }) => {
    const hashedPassword = await bcrypt.hash(Password, 10);

    const sql = `
      INSERT INTO User (Names, DocumentType, DocumentNumber, BirthDate, Email, Password, Status, Role) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [
      Names,
      DocumentType,
      DocumentNumber,
      BirthDate,
      Email,
      hashedPassword,
      Status,
      Role
    ]);
    return result;
  },

  findAll: async () => {
    const sql = "SELECT UserId, Names, DocumentType, DocumentNumber, BirthDate, Email, Status, Role FROM User";
    const [rows] = await db.query(sql);
    return rows;
  },

  findById: async (id) => {
    const sql = "SELECT UserId, Names, DocumentType, DocumentNumber, BirthDate, Email, Status, Role FROM User WHERE UserId = ?";
    const [rows] = await db.query(sql, [id]);
    return rows[0];
  },

  update: async (id, { Names, DocumentType, DocumentNumber, BirthDate, Email, Password, Status, Role }) => {
    let sql;
    let params;

    if (Password) {
      const hashedPassword = await bcrypt.hash(Password, 10);
      sql = `
        UPDATE User 
        SET Names = ?, DocumentType = ?, DocumentNumber = ?, BirthDate = ?, Email = ?, Password = ?, Status = ?, Role = ?
        WHERE UserId = ?
      `;
      params = [Names, DocumentType, DocumentNumber, BirthDate, Email, hashedPassword, Status, Role, id];
    } else {
      sql = `
        UPDATE User 
        SET Names = ?, DocumentType = ?, DocumentNumber = ?, BirthDate = ?, Email = ?, Status = ?, Role = ?
        WHERE UserId = ?
      `;
      params = [Names, DocumentType, DocumentNumber, BirthDate, Email, Status, Role, id];
    }

    const [result] = await db.query(sql, params);
    return result;
  },

  remove: async (id) => {
    const sql = "DELETE FROM User WHERE UserId = ?";
    const [result] = await db.query(sql, [id]);
    return result;
  },
};

module.exports = Account;