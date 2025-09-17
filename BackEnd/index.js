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
  res.send(" <center><h1>Backend de logística de eventos funcionando!</h1></center> ");
});

// --- RUTAS DE AUTENTICACIÓN ---
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

// --- RUTAS DE CONTRASEÑAS (cambio desde perfil) ---
const passwordChangeRoutes = require("./routes/PasswordChange");
app.use("/api/password", passwordChangeRoutes);

// --- RUTAS DE PREGUNTAS/ENCUESTAS ---
const questionRoutes = require("./routes/Admin/questions");
app.use("/api/questions", questionRoutes);

// --- RUTAS DE RECURSOS ---
const resourceRoutes = require("./routes/Admin/Resources");
app.use("/api/resources", resourceRoutes);

// --- RUTAS DE EVENTOS ---
const eventRoutes = require("./routes/Admin/Events");
app.use("/api/events", eventRoutes);

// --- RUTAS DE GESTIÓN DE CUENTAS ---
const accountsRoutes = 
require("./routes/admin/accounts");
app.use("/api/accounts", accountsRoutes);

// --- RUTAS DE PERFIL ---
const profileRoutes = require("./routes/Profile");
app.use("/api/profile", profileRoutes);

// --- RUTAS DE SOLICITUDES ---
const requestRoutes = require("./routes/user/Request");
app.use("/api/requests", requestRoutes);

// --- SERVIDOR ---
app.listen(PORT, () => {
  console.log( 'Servidor backend corriendo en http://localhost:${PORT}');
});