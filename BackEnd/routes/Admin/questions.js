// routes/admin/questions.js
const express = require("express");
const router = express.Router();
const {
  createQuestion,
  getAllQuestions
} = require("../../controllers/QuestionController");

router.post("/questions", createQuestion);
router.get("/questions", getAllQuestions);

module.exports = router;