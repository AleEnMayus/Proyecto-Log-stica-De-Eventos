const Request = require("../models/Request");
const Event = require("../models/Events");

function formatDateForMySQL(dateString) {
  const date = new Date(dateString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Mes 0-11
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

const requestController = {
  getAll: async (req, res) => {
    try {
      const requests = await Request.getAll();
      res.json(requests);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al obtener solicitudes" });
    }
  },

  getById: async (req, res) => {
    try {
      const request = await Request.getById(req.params.id);
      if (!request) return res.status(404).json({ error: "Solicitud no encontrada" });
      res.json(request);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al obtener la solicitud" });
    }
  },

  create: async (req, res) => {
    try {
      let { RequestDate, RequestDescription, RequestType, UserId, EventId } = req.body;

      const validTypes = ['schedule_appointment', 'cancel_event', 'document_change'];
      if (!validTypes.includes(RequestType)) {
        return res.status(400).json({ error: "Tipo de solicitud inválido" });
      }

      if (RequestType === 'cancel_event' && !EventId) {
        return res.status(400).json({ error: "EventId es obligatorio para cancelar un evento" });
      }

      // Formatear la fecha
      if (RequestDate) {
        RequestDate = formatDateForMySQL(RequestDate);
      }

      const id = await Request.create({
        RequestDate,
        RequestDescription,
        RequestType,
        UserId,
        EventId: EventId || null
      });

      res.status(201).json({ message: "Solicitud creada", RequestId: id });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al crear la solicitud" });
    }
  },

   updateStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const validStatus = ['pending', 'approved', 'rejected'];
      if (!validStatus.includes(status)) {
        return res.status(400).json({ error: "Estado inválido" });
      }

      // Obtener la solicitud antes de actualizar
      const request = await Request.getById(req.params.id);
      if (!request) return res.status(404).json({ error: "Solicitud no encontrada" });

      // Actualizar la solicitud
      const affected = await Request.updateStatus(req.params.id, status);

      if (request.RequestType === "cancel_event" && status === "approved") {
        if (!request.EventId) return res.status(400).json({ error: "No se especificó el evento a cancelar" });

        const statusMap = {
          canceled: "Canceled",
          "in planning": "In planning",
          "in execution": "In execution",
          completed: "Completed"
        };

        await Event.updateEvent(request.EventId, { EventStatus: statusMap["canceled"] });
      }

      res.json({ message: "Estado actualizado" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al actualizar estado" });
    }
  },

  delete: async (req, res) => {
    try {
      const affected = await Request.delete(req.params.id);
      if (!affected) return res.status(404).json({ error: "Solicitud no encontrada" });

      res.json({ message: "Solicitud eliminada" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al eliminar solicitud" });
    }
  },
};

module.exports = requestController;