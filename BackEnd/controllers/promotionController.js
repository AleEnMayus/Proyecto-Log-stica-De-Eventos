const Promotion = require("../models/Promotion.js");

// Crear una promoción
const PromotionController = {
  getPromotions: async (req, res) => {
    try {
      const Promotions = await Promotion.findAll();
      res.json(Promotions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al obtener solicitudes" });
    }
  }
};
module.exports = PromotionController;