const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db"); // conexión a la base de datos

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// --- RUTA DE PRUEBA ---
app.get("/", (req, res) => {
  res.send(" Backend de logística de eventos funcionando!");
});

// --- RUTA DE USUARIOS ---
app.get("/api/usuarios", (req, res) => {
  db.query("SELECT * FROM user", (err, results) => {
    if (err) {
      console.error("Error en consulta:", err);
      return res.status(500).json({ error: "Error al obtener usuarios" });
    }
    res.json(results);
  });
});

// --- RUTAS DE AUTENTICACIÓN ---
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

// --- RUTAS DE PREGUNTAS/ENCUESTAS ---
const questionRoutes = require("./routes/Admin/questions");
app.use("/api/questions", questionRoutes);

// --- RUTAS DE RECURSOS ---
const resourceRoutes = require("./routes/Admin/Resources");
app.use("/api/resources", resourceRoutes);

// --- RUTAS DE EVENTOS ---
const eventRoutes = require("./routes/Admin/Events");
app.use("/api/events", eventRoutes);




// Rutas
const scheduleRoutes = require("./routes/Admin/Schedule");
app.use("/api/admin/schedules", scheduleRoutes);


// --- SERVIDOR ---
app.listen(PORT, () => {
  console.log(` Servidor backend corriendo en http://localhost:${PORT}`);
});