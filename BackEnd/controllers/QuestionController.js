const db = require("../db"); // conexión a la base de datos
const Question = require("../models/Question"); // importar modelo

// Crear varias preguntas a la vez
const createMultipleQuestions = async (req, res) => {
  try {
    const { questions } = req.body; // se espera un array de strings

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "Debes enviar un array de preguntas" });
    }

    // Verificar cuántas ya existen
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM questions");
    const total = rows[0].total;

    if (total + questions.length > 5) {
      return res.status(400).json({
        error: `Solo puedes tener 5 preguntas en total. Ya tienes ${total}, intentas agregar ${questions.length}`
      });
    }

    // Insertar todas en una sola query
    const values = questions.map((q) => [q.trim()]);
    const [result] = await db.query(
      "INSERT INTO questions (QuestionText) VALUES ?",
      [values]
    );

    res.status(201).json({
      message: "Preguntas agregadas con éxito",
      inserted: questions.length,
      firstInsertId: result.insertId
    });
  } catch (err) {
    console.error("Error al crear varias preguntas:", err);
    res.status(500).json({ error: "Error interno al guardar las preguntas" });
  }
};

// Obtener todas las preguntas
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll();
    res.json(questions);
  } catch (err) {
    console.error("Error al obtener preguntas:", err);
    res.status(500).json({ error: "Error al obtener preguntas" });
  }
};

module.exports = {
  getAllQuestions,
  createMultipleQuestions
};
