// backend/index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db"); // conexión a la base de datos

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

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
const questionRoutes = require("./routes/admin/questions"); 
app.use("/api/questions", questionRoutes);

// Rutas de recursos
const resourceRoutes = require("./routes/admin/Resources");
app.use("/api/resources", resourceRoutes);

// Rutas de eventos
const eventRoutes = require("./routes/admin/Events");
app.use("/api/events", eventRoutes);

// Rutas de cuentas
const accountRoutes = require("./routes/admin/accounts");
app.use("/api/accounts", accountRoutes);

// Ruta protegida de ejemplo (requiere token)
// Ruta protegida desactivada temporalmente
/*
const authMiddleware = require("./middlewares/authMiddleware");
app.get("/api/encuesta", authMiddleware, (req, res) => {
  res.json({ message: "Acceso autorizado a encuesta", user: req.user });
});
*/

app.listen(PORT, () => {
  console.log(` Servidor backend corriendo en http://localhost:${PORT}`);
});