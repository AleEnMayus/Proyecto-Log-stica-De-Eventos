// backend/index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Endpoint de prueba
app.get("/api/usuarios", (req, res) => {
  db.query("SELECT * FROM user", (err, results) => {
    if (err) {
      console.error("Error en consulta:", err);
      res.status(500).json({ error: "Error al obtener usuarios" });
    } else {
      res.json(results);
    }
  });
});

// Rutas
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});