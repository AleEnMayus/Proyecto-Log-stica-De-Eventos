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

// --- RUTAS DE CITAS ---
const scheduleRoutes = require("./routes/Admin/Schedule");
app.use("/api/admin/schedules", scheduleRoutes);

// --- RUTAS DE gestion de CUENTAS ---
const accountsRoutes = require("./routes/admin/accounts");
app.use("/api/accounts", accountsRoutes);

// --- SERVIDOR ---
app.listen(PORT, () => {
  console.log(` Servidor backend corriendo en http://localhost:${PORT}`);
});