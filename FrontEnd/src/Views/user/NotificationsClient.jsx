import React, { useEffect, useState } from "react";
import HeaderCl from "../../components/HeaderSidebar/HeaderCl";
import { translateRequestType, translateStatus } from "../../utils/FormatText";
import { socket } from "../../services/socket";
import { useToast } from "../../hooks/useToast";
import ToastContainer from "../../components/ToastContainer";
import "../CSS/Notification.css";

const baseURL = "http://localhost:4000";

const NotificationsClient = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("pendientes");
  const { toasts, addToast, removeToast } = useToast();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  // --- Cargar solicitudes propias ---
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${baseURL}/api/requests`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!res.ok) throw new Error("Error al obtener solicitudes");

      const data = await res.json();
      const userRequests = data.filter((req) => req.UserId == userId);
      setNotifications(userRequests);
    } catch (err) {
      console.error(err);
      addToast("Error al cargar tus notificaciones", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- Socket: conexión y escucha ---
  useEffect(() => {
    if (!userId) return;

    socket.emit("joinRoom", userId);
    console.log(`Cliente conectado a sala user_${userId}`);

    socket.on("notification:client", (data) => {
      console.log("Nueva notificación cliente:", data);
      addToast(data.message, "info");

      setNotifications((prev) => [
        {
          RequestId: data.requestId,
          RequestStatus: data.status || "actualizada",
          RequestDescription: data.message,
          RequestDate: new Date().toISOString(),
          RequestType: data.type || "Solicitud",
        },
        ...prev,
      ]);
    });

    return () => {
      socket.off("notification:client");
    };
  }, [userId]);

  useEffect(() => {
    fetchRequests();
  }, []);

  // Separar notificaciones por estado
  const pendientes = notifications.filter((n) => n.RequestStatus === "pending");
  const gestionadas = notifications.filter((n) => n.RequestStatus !== "pending");

  // Obtener las notificaciones según la sección activa
  const currentNotifications = activeSection === "pendientes" ? pendientes : gestionadas;

  return (
    <div className="contratos-container">
      <HeaderCl />
      <div className="notificaciones-container">
        <div className="header-notificaciones">
          <h1 className="titulo">Mis Notificaciones</h1>
          
          <div className="toggle-section">
            <button
              className={`toggle-btn ${activeSection === "pendientes" ? "active" : ""}`}
              onClick={() => setActiveSection("pendientes")}
            >
              Pendientes ({pendientes.length})
            </button>
            <button
              className={`toggle-btn ${activeSection === "gestionadas" ? "active" : ""}`}
              onClick={() => setActiveSection("gestionadas")}
            >
              Gestionadas ({gestionadas.length})
            </button>
          </div>
        </div>

        {loading ? (
          <p>Cargando...</p>
        ) : notifications.length === 0 ? (
          <p>No tienes notificaciones por ahora</p>
        ) : (
          <div className="lista">
            {currentNotifications.length === 0 ? (
              <p>No hay notificaciones en esta sección</p>
            ) : (
              currentNotifications.map((n) => (
                <div
                  key={n.RequestId}
                  className={`card ${
                    n.RequestStatus !== "pending" ? `card-${n.RequestStatus}` : ""
                  }`}
                  data-status={n.RequestStatus}
                >
                  <h2>{translateRequestType(n.RequestType)}</h2>
                  <p>{n.RequestDescription}</p>
                  <p className={`estado estado-${n.RequestStatus}`}>
                    Estado: {translateStatus(n.RequestStatus)}
                  </p>
                  <p className="fecha-gestion">
                    Fecha: {new Date(n.RequestDate).toLocaleString("es-ES")}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default NotificationsClient;