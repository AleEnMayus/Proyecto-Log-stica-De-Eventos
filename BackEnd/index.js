// backend/index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db"); // conexión a la base de datos
const authMiddleware = require("./middleware/authMiddleware"); // si lo necesitas

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// --- Rutas ---
app.get("/", (req, res) => {
  res.send(" Backend de logística de eventos funcionando!");
});

// Ruta de usuarios de ejemplo
app.get("/api/usuarios", (req, res) => {
  db.query("SELECT * FROM user", (err, results) => {
    if (err) {
      console.error("Error en consulta:", err);
      return res.status(500).json({ error: "Error al obtener usuarios" });
    }
    res.json(results);
  });
});

// Rutas de autenticación
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

// Rutas de preguntas/encuestas
const questionRoutes = require("./routes/Admin/questions"); 
app.use("/api", questionRoutes);

// ✅ Rutas de recursos
const resourceRoutes = require("./routes/Admin/Resources");
app.use("/api/resources", resourceRoutes);

// Ruta protegida de ejemplo (requiere token)
app.get("/api/encuesta", authMiddleware, (req, res) => {
  res.json({ message: "Acceso autorizado a encuesta", user: req.user });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(` Servidor backend corriendo en http://localhost:${PORT}`);
});