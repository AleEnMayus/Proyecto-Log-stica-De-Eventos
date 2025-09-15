// controllers/QuestionController.js
const db = require("../db"); // conexión a la base de datos

// Crear una pregunta
const createQuestion = (req, res) => {
  const { QuestionText } = req.body;

  // Validar que se envíe texto
  if (!QuestionText || QuestionText.trim() === "") {
    return res.status(400).json({ error: "El texto de la pregunta es obligatorio" });
  }

  // Verificar cuántas preguntas hay ya en la BD
  db.query("SELECT COUNT(*) AS total FROM questions", (err, results) => {
    if (err) {
      console.error("Error al contar preguntas:", err);
      return res.status(500).json({ error: "Error interno al verificar preguntas" });
    }

    const total = results[0].total;

    if (total >= 5) {
      return res.status(400).json({ error: "No se pueden agregar más de 5 preguntas" });
    }

    // Insertar la nueva pregunta
    db.query(
      "INSERT INTO questions (QuestionText) VALUES (?)",
      [QuestionText.trim()],
      (err, result) => {
        if (err) {
          console.error("Error al insertar pregunta:", err);
          return res.status(500).json({ error: "Error al guardar la pregunta" });
        }

        res.status(201).json({
          message: "Pregunta agregada con éxito",
          question: { id: result.insertId, text: QuestionText.trim() },
        });
      }
    );
  });
};

// Obtener todas las preguntas
const getAllQuestions = (req, res) => {
  db.query("SELECT * FROM questions", (err, results) => {
    if (err) {
      console.error("Error al obtener preguntas:", err);
      return res.status(500).json({ error: "Error al obtener preguntas" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No hay preguntas registradas" });
    }

    res.json(results);
  });
};

module.exports = {
  createQuestion,
  getAllQuestions,
};
