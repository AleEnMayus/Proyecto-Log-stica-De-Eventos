const db = require("../db");

const EventModel = {
  getAllEvents: async () => {
    const [rows] = await db.query("SELECT * FROM Events");
    return rows;
  },

  addEvent: async (eventData) => {
    const sql = `
      INSERT INTO Events 
      (EventName, ClientId, EventStatus, Capacity, EventPrice, AdvancePaymentMethod, CreationDate, EventDateTime, Address, EventDescription, Contract, ContractNumber)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      eventData.EventName || null,
      eventData.ClientId || null,
      eventData.EventStatus || "In planning",
      eventData.Capacity || null,
      eventData.EventPrice || null,
      eventData.AdvancePaymentMethod || null,
      eventData.CreationDate || new Date(),
      eventData.EventDateTime || null,
      eventData.Address || null,
      eventData.EventDescription || null,
      eventData.Contract || null,
      eventData.ContractNumber || null
    ];
    const [result] = await db.query(sql, values);
    return result.insertId;
  },

  getEventById: async (id) => {
    const [rows] = await db.query("SELECT * FROM Events WHERE EventId = ?", [id]);
    return rows[0];
  },

  updateEvent: async (id, eventData) => {
    const fields = [];
    const values = [];

    for (const key of [
      "EventName",
      "ClientId",
      "EventStatus",
      "Capacity",
      "EventPrice",
      "AdvancePaymentMethod",
      "EventDateTime",
      "Address",
      "EventDescription",
      "Contract",
      "ContractNumber"
    ]) {
      if (eventData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(eventData[key]);
      }
    }

    if (fields.length === 0) return 0;

    values.push(id);
    const sql = `UPDATE Events SET ${fields.join(", ")} WHERE EventId = ?`;
    const [result] = await db.query(sql, values);
    return result.affectedRows;
  },

  deleteEvent: async (id) => {
    const [result] = await db.query("DELETE FROM Events WHERE EventId = ?", [id]);
    return result.affectedRows;
  }
};

module.exports = EventModel;