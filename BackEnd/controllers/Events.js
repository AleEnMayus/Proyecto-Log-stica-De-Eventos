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
      resources // 👈 opcional
    } = req.body;

    // 1️⃣ Insertar evento
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

    // 2️⃣ Obtener evento recién creado
    const newEvent = await Event.getEventById(eventId);

    // 3️⃣ Asignar recursos si vienen en el body
    let resourceResult = [];
    if (resources && resources.length > 0) {
      resourceResult = await EventResources.assignResources(eventId, resources);
    }

    // 4️⃣ Responder con evento + recursos
    res.status(201).json({
      event: newEvent,
      resources: resourceResult
    });

  } catch (err) {
    console.error("Error creando evento:", err); // 👈 esto ya lo tienes
    res.status(500).json({ error: err.message }); // 👈 devuelve mensaje real
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

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
