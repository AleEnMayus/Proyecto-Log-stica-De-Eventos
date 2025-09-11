// backend/index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");
const authMiddleware = require("./middleware/authMiddleware"); // Importar middleware

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Endpoint de prueba público
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

// Rutas de autenticación (login, register)
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

// Ruta protegida con middleware de autenticación
app.get("/api/encuesta", authMiddleware, (req, res) => {
  // Aquí el usuario está autenticado y su info está en req.user
  res.json({ message: "Acceso autorizado a encuesta", user: req.user });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
