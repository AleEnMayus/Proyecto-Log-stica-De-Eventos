const Survey = require("../models/Survey");

// Enviar encuesta
const submitSurvey = async (req, res) => {
  try {
    const { EventId, UserId, Answers } = req.body;

    if (!EventId || !UserId || !Answers) {
      return res.status(400).json({ error: "Faltan datos en la encuesta" });
    }

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
    const [results] = await Survey.getAllAnswers();
    res.json(results);
  } catch (err) {
    console.error("Error al obtener respuestas:", err);
    res.status(500).json({ error: "Error interno al obtener respuestas" });
  }
};

module.exports = { submitSurvey, getAllAnswers };
