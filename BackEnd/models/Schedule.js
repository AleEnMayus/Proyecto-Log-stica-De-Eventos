// models/Schedule.js
const db = require("../db");

const ScheduleModel = {
  // 📌 Crear nueva cita
  addSchedule: async ({ RequestDate, RequestDescription, RequestType, UserId }) => {
    const sql = `
      INSERT INTO Requests (RequestDate, RequestDescription, RequestType, RequestStatus, UserId)
      VALUES (?, ?, ?, 'pending', ?)
    `;
    const [result] = await db.query(sql, [
      RequestDate,
      RequestDescription,
      RequestType,
      UserId
    ]);
    return result; // result.insertId disponible en controller
  },

  // 📌 Obtener todas las citas
  getAllSchedules: async () => {
    const sql = "SELECT * FROM Requests ORDER BY RequestDate DESC";
    const [rows] = await db.query(sql);
    return rows;
  },

  // 📌 Actualizar estado de una cita
  updateScheduleStatus: async (id, status) => {
    const sql = "UPDATE Requests SET RequestStatus = ? WHERE RequestId = ?";
    const [result] = await db.query(sql, [status, id]);
    return result; // result.affectedRows disponible en controller
  }
};

module.exports = ScheduleModel;
