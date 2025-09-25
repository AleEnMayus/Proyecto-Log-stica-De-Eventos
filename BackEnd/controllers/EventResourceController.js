const EventResourcesModel = require("../models/EventResourceModel");

const EventResourcesController = {
  getResourcesByEventId: async (req, res) => {
    const { eventId } = req.params;

    try {
      const resources = await EventResourcesModel.getResourcesByEventId(eventId);

      if (resources.length === 0) {
        return res.status(404).json({ message: "No se encontraron recursos para este evento." });
      }

      res.json(resources);
    } catch (error) {
      console.error("Error en getResourcesByEventId:", error);
      res.status(500).json({ message: "Error en el servidor." });
    }
  },
};

module.exports = EventResourcesController;
