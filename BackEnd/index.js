// backend/index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db"); // conexión a la base de datos

const app = express();
const PORT = process.env.PORT || 4000;

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// --- RUTA DE PRUEBA ---
app.get("/", (req, res) => {
  res.send(" Backend de logística de eventos funcionando!");
});

// --- RUTA DE USUARIOS ---
app.get("/api/usuarios", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM user");
    res.json(results);
  } catch (err) {
    console.error("Error en consulta:", err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
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

// --- RUTAS DE CUENTAS ---
const accountRoutes = require("./routes/admin/accounts");
app.use("/api/accounts", accountRoutes);

// --- RUTAS DE CITAS (SCHEDULES) ---
const scheduleRoutes = require("./routes/Admin/Schedule");
app.use("/api/admin/schedules", scheduleRoutes);

// --- RUTA PROTEGIDA (ejemplo, desactivada temporalmente) ---
// const authMiddleware = require("./middlewares/authMiddleware");
// app.get("/api/encuesta", authMiddleware, (req, res) => {
//   res.json({ message: "Acceso autorizado a encuesta", user: req.user });
// });

// --- SERVIDOR ---
app.listen(PORT, () => {
  console.log(` Servidor backend corriendo en http://localhost:${PORT}`);
});