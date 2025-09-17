const db = require("../db");

const EventResources = {
  assignResources: async (eventId, resources) => {
    try {
      // Validar que el evento exista
      const [eventRows] = await db.query("SELECT * FROM Events WHERE EventId = ?", [eventId]);
      if (eventRows.length === 0) {
        throw new Error("Evento no encontrado");
      }

      const results = [];
      for (const r of resources) {
        const sql = `
          INSERT INTO EventResources (AssignedQuantity, AssignmentStatus, EventId, ResourceId, Prices)
          VALUES (?, ?, ?, ?, ?)
        `;
        const values = [
          r.quantity,
          r.status,
          eventId,
          r.resourceId,
          r.price
        ];
        const [result] = await db.query(sql, values);
        results.push({ id: result.insertId, ...r });
      }
      return results;
    } catch (error) {
      console.error("Error en assignResources:", error);
      throw error;
    }
  },

  getResourcesByEvent: async (eventId) => {
    const [rows] = await db.query("SELECT * FROM EventResources WHERE EventId = ?", [eventId]);
    return rows;
  }
};

module.exports = EventResources;
