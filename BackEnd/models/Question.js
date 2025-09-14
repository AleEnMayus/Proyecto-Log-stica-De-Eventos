// models/Question.js
const db = require("../db");

const Question = {
  create: (text, callback) => {
    const query = "INSERT INTO questions (QuestionText) VALUES (?)";
    db.query(query, [text], callback);
  },

  findAll: (callback) => {
    const query = "SELECT * FROM questions";
    db.query(query, callback);
  }
};

module.exports = Question;