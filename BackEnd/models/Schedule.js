const db = require("../db");

module.exports = {
  // 📌 Crear cita
  addSchedule: async (data) => {
    try {
      const [result] = await db.query(
        `INSERT INTO Requests (RequestDate, RequestDescription, RequestType, RequestStatus, UserId)
         VALUES (?, ?, ?, 'pending', ?)`,
        [data.RequestDate, data.RequestDescription, data.RequestType, data.UserId]
      );
      return result;
    } catch (err) {
      throw err;
    }
  },

  // 📌 Obtener todas las citas
  getAllSchedules: async () => {
    try {
      const [rows] = await db.query("SELECT * FROM Requests");
      return rows;
    } catch (err) {
      throw err;
    }
  },

  // 📌 Cambiar estado
  updateScheduleStatus: async (id, status) => {
    try {
      const [result] = await db.query(
        "UPDATE Requests SET RequestStatus = ? WHERE RequestId = ?",
        [status, id]
      );
      return result;
    } catch (err) {
      throw err;
    }
  },
};