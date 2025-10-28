const pool = require('../db');

const getAllEvents = async () => {
  const [rows] = await pool.query('SELECT * FROM events ORDER BY EventDateTime ASC');
  return rows;
};

module.exports = {
  getAllEvents,
};


