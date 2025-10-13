function notificationSocket(io) {
  io.on("connection", socket => {
    console.log("/ Nuevo cliente conectado:", socket.id);

    // Unirse a la sala correcta
    socket.on("joinRoom", userIdOrRole => {
      if(userIdOrRole === "admins") {
        socket.join("admins"); // Sala de admins
        console.log(`Admin unido a sala admins`);
      } else {
        socket.join(`user_${userIdOrRole}`); // Sala de cliente
        console.log(`Usuario ${userIdOrRole} unido a sala user_${userIdOrRole}`);
      }
    });

    // Emitir notificación a admins
    socket.on("notifyAdmin", (data) => {
      io.to("admins").emit("notification:admin", data);
    });

    // Emitir notificación a cliente específico
    socket.on("notifyClient", (userId, data) => {
      io.to(`user_${userId}`).emit("notification:client", data);
    });

    socket.on("disconnect", () => {
      console.log("X Cliente desconectado:", socket.id);
    });
  });
}

module.exports = { notificationSocket };