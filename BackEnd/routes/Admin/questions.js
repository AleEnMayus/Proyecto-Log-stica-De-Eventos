// backend/routes/questions.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// POST - Insertar una nueva pregunta
router.post("/questions", (req, res) => {
  const { QuestionText } = req.body; // lo que viene del frontend

  if (!QuestionText) {
    return res.status(400).json({ error: "QuestionText is required" });
  }

  const query = "INSERT INTO questions (QuestionText) VALUES (?)";

  db.query(query, [QuestionText], (err, result) => {
    if (err) {
      console.error("❌ Error inserting question:", err);
      return res.status(500).json({ error: "Error saving question" });
    }
    res.status(201).json({ message: "✅ Question saved", id: result.insertId });
  });
});

// GET - Listar todas las preguntas
router.get("/questions", (req, res) => {
  const query = "SELECT * FROM questions";

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching questions:", err);
      return res.status(500).json({ error: "Error fetching questions" });
    }
    res.json(results);
  });
});

module.exports = router;
