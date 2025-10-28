const Survey = require("../models/Survey");

// POST /api/survey
async function submitSurvey(req, res) {
  try {
    const { Answers, EventId, UserId } = req.body;

    if (!EventId || !UserId || !Answers) {
      return res.status(400).json({ error: "Faltan datos en la encuesta" });
    }

    const result = await Survey.saveSurvey(EventId, UserId, Answers);

    res.json({ message: "Encuesta guardada con éxito", result });
  } catch (err) {
    console.error("Error al guardar encuesta:", err);
    res.status(500).json({ error: "Error al guardar encuesta" });
  }
}

module.exports = { submitSurvey };