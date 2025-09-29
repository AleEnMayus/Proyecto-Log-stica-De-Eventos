const Event = require("../models/Events");
const EventResources = require("../models/EventResources");
const db = require("../db");

// Listado de eventos (resumido)
async function getEvents(req, res) {
  try {
    const events = await Event.getEvents();
    res.json(events);
  } catch (err) {
    console.error("Error obteniendo eventos:", err);
    res.status(500).json({ error: "Error al obtener eventos" });
  }
}

// Nuevo: Obtener eventos de un usuario por su ID
async function getEventsByUserId(req, res) {
  try {
    const { userId } = req.params;

    // Traer todos los eventos del usuario
    const [events] = await db.query(
      "SELECT * FROM Events WHERE ClientId = ?",
      [userId]
    );

    if (events.length === 0) {
      return res.status(404).json({ error: "No se encontraron eventos para este usuario" });
    }

    // Para cada evento, traer sus recursos
    const eventsWithResources = await Promise.all(
      events.map(async (event) => {
        const resources = await EventResources.getResourcesByEvent(event.EventId);
        return { ...event, resources: resources || [] };
      })
    );

    res.json(eventsWithResources);
  } catch (err) {
    console.error("Error obteniendo eventos por usuario:", err);
    res.status(500).json({ error: "Error al obtener eventos del usuario" });
  }
}

// Detalle de un evento por ID
async function getEventById(req, res) {
  try {
    const { id } = req.params;
    const event = await Event.getEventById(id);

    if (!event) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    // Obtener recursos vinculados al evento
    const resources = await EventResources.getResourcesByEvent(id);

    // Devolver evento + recursos
    res.json({
      ...event,
      resources: resources || []
    });
  } catch (err) {
    console.error("Error obteniendo evento por ID:", err);
    res.status(500).json({ error: "Error al obtener evento" });
  }
}

// Crear nuevo evento
async function createEvent(req, res) {
  try {
    const {
      EventName,
      ClientIdentifier,
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
      resources
    } = req.body;

    let resolvedClientId = ClientId;

    if (!resolvedClientId && ClientIdentifier) {
      const [rows] = await db.query(
        `SELECT UserId FROM User 
         WHERE Email = ? OR DocumentNumber = ? 
         LIMIT 1`,
        [ClientIdentifier, ClientIdentifier]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: "Cliente no encontrado" });
      }
      resolvedClientId = rows[0].UserId;
    }

    if (!resolvedClientId) {
      return res.status(400).json({ error: "Debe especificar un cliente" });
    }

    const eventId = await Event.addEvent({
      EventName,
      ClientId: resolvedClientId,
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

    const newEvent = await Event.getEventById(eventId);

    let resourceResult = [];
    if (resources && resources.length > 0) {
      resourceResult = await EventResources.assignResources(eventId, resources);
    }

    res.status(201).json({ event: newEvent, resources: resourceResult });
  } catch (err) {
    console.error("Error creando evento:", err);
    res.status(500).json({ error: err.message });
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
    console.error("Error actualizando estado:", err);
    res.status(500).json({ error: "Error actualizando estado" });
  }
}

async function updateEvent(req, res) {
  try {
    const { id } = req.params;
    const updated = await Event.updateEvent(id, req.body);
    updated
      ? res.json({ message: "Evento actualizado correctamente" })
      : res.status(404).json({ error: "Evento no encontrado" });
  } catch (err) {
    console.error("Error actualizando evento:", err);
    res.status(500).json({ error: "Error actualizando evento" });
  }
}

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

module.exports = {
  getEvents,
  getEventById,
  getEventsByUserId,
  createEvent,
  updateEvent,
  deleteEvent,
  updateEventStatus
};