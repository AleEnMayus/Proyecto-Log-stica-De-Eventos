// BackEnd/DataBase/db.js
const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",          //  tu usuario MySQL
  password: "",           //  tu contraseña MySQL
  database: "eventosdb"   //  el nombre de tu base de datos
});

module.exports = db;
