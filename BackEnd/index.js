const express = require("express");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const { notificationSocket } = require("./sockets/notificationSocket");
const db = require("./db");
const { startEventCompletionJob } = require('./jobs/eventCompletionJob');

const app = express();
const PORT = process.env.PORT || 4000;

// Crear servidor HTTP
const server = http.createServer(app);

// Inicializar Socket.IO
const { init } = require("./sockets/socket");
const io = init(server);

notificationSocket(io);

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.get("/", (req, res) => {
  res.send("<center><h1>Backend funcionando con Socket.IO !</h1></center>");
});

app.use("/api", require("./routes/auth"));
app.use("/api/password", require("./routes/PasswordChange"));
app.use("/api/questions", require("./routes/Admin/questions"));
app.use("/api/survey", require("./routes/user/Survey"));
app.use("/api/resources", require("./routes/Admin/Resources"));
app.use("/api/events", require("./routes/Admin/Events"));
app.use("/api/accounts", require("./routes/admin/accounts"));
app.use("/api/profile", require("./routes/Profile"));
app.use("/api/requests", require("./routes/user/Request"));
app.use("/api", require("./routes/Admin/contractRoutes"));
app.use("/api/promotions", require("./routes/Admin/promotions")); 


// Jobs automáticos
startEventCompletionJob();

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`/ Backend corriendo en http://localhost:${PORT}`);
  console.log("Socket.IO activo para notificaciones en tiempo real");
});
