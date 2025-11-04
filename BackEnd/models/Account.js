const Survey = require("../models/Survey");
const Account = require("../models/Account"); // Modelo de usuarios
const Event = require("../models/Events");     // Modelo de eventos (singular, según tu modelo)

// Enviar encuesta
const submitSurvey = async (req, res) => {
  try {
    const { EventId, UserId, Answers } = req.body;

    // Validación básica de datos
    if (!EventId || !UserId || !Answers) {
      return res.status(400).json({ error: "Faltan datos en la encuesta" });
    }

    // Validar que el usuario exista
    const user = await Account.findById(UserId);
    console.log("Buscando usuario con ID:", UserId, "Resultado:", user);
    if (!user) {
      return res.status(400).json({ error: "Usuario no existe" });
    }

    // Validar que el evento exista
    const event = await Event.findById(EventId);
    console.log("Buscando evento con ID:", EventId, "Resultado:", event);
    if (!event) {
      return res.status(400).json({ error: "Evento no existe" });
    }

    // Guardar encuesta
    const result = await Survey.saveSurvey(EventId, UserId, Answers);

    res.status(201).json({
      message: "Encuesta guardada con éxito",
      result,
    });
  } catch (err) {
    console.error("Error al guardar encuesta:", err);
    res.status(500).json({ error: "Error interno al guardar encuesta" });
  }
};

// Obtener todas las respuestas (admin)
const getAllAnswers = async (req, res) => {
  try {
    const results = await Survey.getAllAnswers(); // Ajuste: tu modelo ya retorna array
    res.json(results);
  } catch (err) {
    console.error("Error al obtener respuestas:", err);
    res.status(500).json({ error: "Error interno al obtener respuestas" });
  }
};

module.exports = { submitSurvey, getAllAnswers };