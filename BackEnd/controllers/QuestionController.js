// controllers/QuestionController.js
const Question = require("../models/Question");

exports.createQuestion = (req, res) => {
  const { QuestionText } = req.body;

  if (!QuestionText) {
    return res.status(400).json({ error: "QuestionText is required" });
  }

  Question.create(QuestionText, (err, result) => {
    if (err) {
      console.error("Error inserting question:", err);
      return res.status(500).json({ error: "Error saving question" });
    }
    res.status(201).json({ message: "Question saved", id: result.insertId });
  });
};

exports.getAllQuestions = (req, res) => {
  Question.findAll((err, results) => {
    if (err) {
      console.error("Error fetching questions:", err);
      return res.status(500).json({ error: "Error fetching questions" });
    }
    res.json(results);
  });
};