const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");
const { startEventCompletionJob } = require('./jobs/eventCompletionJob');

const app = express();
const PORT = process.env.PORT || 4000;

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// --- RUTA DE PRUEBA ---
app.get("/", (req, res) => {
  res.send(" <center><h1>Backend de logística de eventos funcionando!</h1></center> ");
});

// --- RUTAS DE AUTENTICACIÓN ---
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

// --- RUTAS DE CONTRASEÑAS ---
const passwordChangeRoutes = require("./routes/PasswordChange");
app.use("/api/password", passwordChangeRoutes);

// --- RUTAS DE PREGUNTAS/ENCUESTAS ---
const questionRoutes = require("./routes/Admin/questions");
app.use("/api/questions", questionRoutes);

// --- RUTAS DE PREGUNTAS/ENCUESTAS ---
const surveyRoutes = require("./routes/user/Survey");
app.use("/api", surveyRoutes);

// --- RUTAS DE RECURSOS ---
const resourceRoutes = require("./routes/Admin/Resources");
app.use("/api/resources", resourceRoutes);

// --- RUTAS DE EVENTOS ---
const eventRoutes = require("./routes/Admin/Events");
app.use("/api/events", eventRoutes);

// --- RUTAS DE GESTIÓN DE CUENTAS ---
const accountsRoutes = require("./routes/admin/accounts");
app.use("/api/accounts", accountsRoutes);

// --- RUTAS DE PERFIL ---
const profileRoutes = require("./routes/Profile");
app.use("/api/profile", profileRoutes);

// --- RUTAS DE SOLICITUDES ---
const requestRoutes = require("./routes/user/Request");
app.use("/api/requests", requestRoutes);

// --- RUTAS DE SUBIDA DE CONTRATOS ---
const uploadRoutes = require("./routes/Admin/contractRoutes");
app.use("/api", uploadRoutes);

// --- INICIAR JOBS AUTOMÁTICOS ---
startEventCompletionJob();

// --- SERVIDOR ---
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
  console.log('Job de eventos completados activado');
});