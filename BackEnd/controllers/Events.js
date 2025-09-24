const Event = require("../models/Events");
const EventResources = require("../models/EventResources");

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

// Obtener un evento por id
async function getEventById(req, res) {
  try {
    const { id } = req.params;
    const event = await Event.getEventById(id);

    if (!event) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    res.json(event);
  } catch (err) {
    console.error("Error obteniendo evento por ID:", err);
    res.status(500).json({ error: "Error al obtener evento" });
  }
}

// Crear un nuevo evento
async function createEvent(req, res) {
  try {
    const {
      EventName,
      ClientId,
      EventStatus,
      Capacity,
      EventPrice,
      AdvancePaymentMethod,
      CreationDate,
      EventDateTime,
      Address,
      EventDescription,
      Contract,
      ContractNumber,
      RequestId,
      resources // opcional
    } = req.body;

    // Insertar evento
    const eventId = await Event.addEvent({
      EventName,
      ClientId,
      EventStatus,
      Capacity,
      EventPrice,
      AdvancePaymentMethod,
      CreationDate,
      EventDateTime,
      Address,
      EventDescription,
      Contract,
      ContractNumber,
      RequestId
    });

    // Obtener evento recién creado
    const newEvent = await Event.getEventById(eventId);

    // Asignar recursos si vienen en el body
    let resourceResult = [];
    if (resources && resources.length > 0) {
      resourceResult = await EventResources.assignResources(eventId, resources);
    }

    // Responder con evento + recursos
    res.status(201).json({
      event: newEvent,
      resources: resourceResult
    });

  } catch (err) {
    console.error("Error creando evento:", err);
    res.status(500).json({ error: err.message }); //  devuelve mensaje real
  }
}

async function updateEventStatus(req, res) {
  try {
    const { id } = req.params;
    const { EventStatus } = req.body;

    if (!EventStatus) {
      return res.status(400).json({ error: "Debes enviar el nuevo estado" });
    }

    const updated = await Event.updateEventStatus(id, EventStatus);

    updated
      ? res.json({ message: "Estado actualizado correctamente" })
      : res.status(404).json({ error: "Evento no encontrado" });

  } catch (err) {
    console.error("Error actualizando estado del evento:", err);
    res.status(500).json({ error: "Error actualizando estado" });
  }
}

// Actualizar evento
async function updateEvent(req, res) {
  try {
    const { id } = req.params;
    const {
      EventName,
      EventStatus,
      Capacity,
      EventPrice,
      AdvancePaymentMethod,
      EventDateTime,
      Address,
      EventDescription,
      Contract,
      ContractNumber
    } = req.body;

    const updatedEvent = await Event.updateEvent(id, {
      EventName,
      EventStatus,
      Capacity,
      EventPrice,
      AdvancePaymentMethod,
      EventDateTime,
      Address,
      EventDescription,
      Contract,
      ContractNumber
    });

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

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent, updateEventStatus };
