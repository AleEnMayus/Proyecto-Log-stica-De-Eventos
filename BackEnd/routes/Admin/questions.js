// routes/admin/questions.js
const express = require("express");
const router = express.Router();
const {
  createQuestion,
  getAllQuestions,
  createMultipleQuestions
} = require("../../controllers/QuestionController");

router.post("/bulk", createMultipleQuestions);
router.get("", getAllQuestions);

module.exports = router;