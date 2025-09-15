// models/Events.js
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
        (EventName, EventStatus, Capacity, EventPrice, AdvancePaymentMethod, CreationDate, EventDateTime, Address, EventDescription, Contract, ContractNumber)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        eventData.EventName,
        eventData.EventStatus,
        eventData.Capacity,
        eventData.EventPrice,
        eventData.AdvancePaymentMethod,
        eventData.CreationDate,
        eventData.EventDateTime,
        eventData.Address,
        eventData.EventDescription,
        eventData.Contract,
        eventData.ContractNumber
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
      SET EventName=?, EventStatus=?, Capacity=?, EventPrice=?, AdvancePaymentMethod=?, EventDateTime=?, Address=?, EventDescription=?, Contract=?, ContractNumber=?
      WHERE EventId=?
    `;
    const values = [
      eventData.EventName,
      eventData.EventStatus,
      eventData.Capacity,
      eventData.EventPrice,
      eventData.AdvancePaymentMethod,
      eventData.EventDateTime,
      eventData.Address,
      eventData.EventDescription,
      eventData.Contract,
      eventData.ContractNumber,
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