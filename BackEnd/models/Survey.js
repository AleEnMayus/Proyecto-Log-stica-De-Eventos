const db = require("../db");

// Guardar respuestas de una encuesta
async function saveSurvey(eventId, userId, answers) {
  // answers es un objeto { idPregunta: valorRespuesta }
  for (const [questionId, answerValue] of Object.entries(answers)) {
    await db.query(
      "INSERT INTO Answers (QuestionId, NumericValue, EventId, UserId) VALUES (?, ?, ?, ?)",
      [questionId, answerValue, eventId, userId]
    );
  }
  return { success: true };
}

module.exports = { saveSurvey };