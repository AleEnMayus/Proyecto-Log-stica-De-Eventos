const db = require("../db");

const Promotion = {
  // Obtener todas las promociones
  findAll: async () => {
    const [rows] = await db.query(`SELECT * FROM Promotions`);
    return rows;
  }
};

module.exports = Promotion;