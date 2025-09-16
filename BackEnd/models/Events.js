const db = require("../db");

const EventModel = {
  // Obtener todos los eventos
  getAllEvents: async () => {
    try {
      const [rows] = await db.query("SELECT * FROM Events");
      return rows;
    } catch (error) {
      console.error("Error en getAllEvents:", error);
      throw error;
    }
  },

  // Crear un nuevo evento
  addEvent: async (eventData) => {
    try {
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
    } catch (error) {
      console.error("Error en addEvent:", error);
      throw error;
    }
  },

  // Obtener un evento por id
  getEventById: async (id) => {
    const [rows] = await db.query("SELECT * FROM Events WHERE EventId = ?", [id]);
    return rows[0];
  },

  // Actualizar un evento
  updateEvent: async (id, eventData) => {
    const sql = `
      UPDATE Events 
      SET EventName=?, ClientId=?, EventStatus=?, Capacity=?, EventPrice=?, AdvancePaymentMethod=?, EventDateTime=?, Address=?, EventDescription=?, Contract=?, ContractNumber=?
      WHERE EventId=?
    `;
    const values = [
      eventData.EventName || null,
      eventData.ClientId || null,
      eventData.EventStatus || "In planning",
      eventData.Capacity || null,
      eventData.EventPrice || null,
      eventData.AdvancePaymentMethod || null,
      eventData.EventDateTime || null,
      eventData.Address || null,
      eventData.EventDescription || null,
      eventData.Contract || null,
      eventData.ContractNumber || null,
      id
    ];
    const [result] = await db.query(sql, values);
    return result.affectedRows;
  },

  // Eliminar un evento
  deleteEvent: async (id) => {
    const [result] = await db.query("DELETE FROM Events WHERE EventId = ?", [id]);
    return result.affectedRows;
  }
};

module.exports = EventModel;
