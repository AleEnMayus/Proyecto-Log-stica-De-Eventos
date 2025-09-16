// models/Question.js
const db = require("../db");

const Question = {
  create: (text, callback) => {
    const query = "INSERT INTO questions (QuestionText) VALUES (?)";
    db.query(query, [text], callback);
  },

  findAll: async () => {
    const query = "SELECT * FROM questions";
    const [rows] = await db.query(query); // usando promesas
    return rows;
  },
};

module.exports = Question;