const db = require("../db");

// Create a new question
exports.createSurvey = (req, res) => {
  const { QuestionText, AnswerId } = req.body;

  const sql = "INSERT INTO questions (QuestionText, AnswerId) VALUES (?, ?)";
  db.query(sql, [QuestionText, AnswerId], (err, result) => {
    if (err) {
      console.error("❌ Error inserting question:", err);
      return res.status(500).json({ error: "Error saving question" });
    }
    res.json({ message: "✅ Question created successfully", id: result.insertId });
  });
};

// Get all questions
exports.getAllSurveys = (req, res) => {
  const sql = "SELECT * FROM questions";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching questions:", err);
      return res.status(500).json({ error: "Error fetching questions" });
    }
    res.json(results);
  });
};

// Get one question by ID
exports.getSurveyById = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM questions WHERE QuestionId = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("❌ Error fetching question:", err);
      return res.status(500).json({ error: "Error fetching question" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json(results[0]);
  });
};
