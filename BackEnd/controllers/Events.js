const Event = require("../models/Events");

// Obtener todos los eventos
async function getEvents(req, res) {
  try {
    const events = await Event.getAllEvents();
    res.json(events);
  } catch (err) {
    console.error("Error obteniendo eventos:", err);
    res.status(500).json({ error: "Error al obtener eventos" });
  }
}

// Crear evento
async function createEvent(req, res) {
  try {
    const { EventName, EventStatus, Capacity, EventPrice, AdvancePaymentMethod, CreationDate, EventDateTime, Address, EventDescription, ContractNumber } = req.body;

    const newEvent = await Event.addEvent(
      EventName, EventStatus, Capacity, EventPrice,
      AdvancePaymentMethod, CreationDate, EventDateTime,
      Address, EventDescription, ContractNumber
    );

    res.status(201).json(newEvent);
  } catch (err) {
    console.error("Error creando evento:", err);
    res.status(500).json({ error: "Error creando evento" });
  }
}

// Actualizar evento
async function updateEvent(req, res) {
  try {
    const { id } = req.params;
    const { EventName, EventStatus, Capacity, EventPrice, AdvancePaymentMethod, EventDateTime, Address, EventDescription, ContractNumber } = req.body;

    const updatedEvent = await Event.updateEvent(
      id, EventName, EventStatus, Capacity, EventPrice,
      AdvancePaymentMethod, EventDateTime, Address,
      EventDescription, ContractNumber
    );

    updatedEvent
      ? res.json(updatedEvent)
      : res.status(404).json({ error: "Evento no encontrado" });

  } catch (err) {
    console.error("Error actualizando evento:", err);
    res.status(500).json({ error: "Error actualizando evento" });
  }
}

// Eliminar evento
async function deleteEvent(req, res) {
  try {
    const { id } = req.params;
    const success = await Event.deleteEvent(id);

    success
      ? res.json({ message: "Evento eliminado correctamente" })
      : res.status(404).json({ error: "Evento no encontrado" });

  } catch (err) {
    console.error("Error eliminando evento:", err);
    res.status(500).json({ error: "Error eliminando evento" });
  }
}

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };