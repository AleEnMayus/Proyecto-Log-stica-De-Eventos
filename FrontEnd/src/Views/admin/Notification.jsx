import React, { useState, useEffect } from "react";
import HeaderAdm from "../../components/HeaderSidebar/HeaderAdm";
import { translateRequestType, translateStatus } from "../../utils/FormatText";
import { useToast } from "../../hooks/useToast";
import { socket } from "../../services/socket";
import ToastContainer from "../../components/ToastContainer";
import "../CSS/Notification.css";

const baseURL = "http://localhost:4000";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("Todo");
  const [showManaged, setShowManaged] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toasts, addToast, removeToast } = useToast();

  // --- Cargar solicitudes desde API ---
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
      setRequests(data);
    } catch (err) {
      console.error(err);
      addToast("Error al cargar notificaciones", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- Actualizar estado de solicitud ---
  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        addToast("No hay token de autenticación", "error");
        return;
      }

      const res = await fetch(`${baseURL}/api/requests/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "Error al actualizar estado");
      }

      const updatedRequest = await res.json();

      addToast(
        newStatus === "approved" ? "Solicitud aceptada" : "Solicitud rechazada",
        "success"
      );

      // Actualizar con la respuesta del servidor que incluye ManagementDate
      setRequests(prev =>
        prev.map(r =>
          r.RequestId === id ? { ...r, ...updatedRequest } : r
        )
      );
    } catch (err) {
      console.error(err);
      addToast(err.message || "Error al actualizar la solicitud", "error");
    }
  };

  // --- Inicializar solicitudes al montar ---
  useEffect(() => {
    fetchRequests();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Escuchar notificaciones en tiempo real ---
  useEffect(() => {
    socket.on("notification:admin", (data) => {
      console.log("Nueva notificación admin:", data);
      
      setRequests(prev => [
        {
          RequestId: data.requestId,
          RequestType: data.requestType,
          RequestDescription: data.message || "Nueva solicitud (Recargar para detalles)",
          RequestStatus: "pending",
          UserId: data.userId,
          RequestDate: new Date().toISOString(),
          ManagementDate: null,
        },
        ...prev,
      ]);
    });

    return () => socket.off("notification:admin");
  }, []);

  // --- Filtrar solicitudes por estado y tipo ---
  const pendingRequests = requests.filter(n => n.RequestStatus === "pending");
  const managedRequests = requests.filter(n => n.RequestStatus !== "pending");
  const currentRequests = showManaged ? managedRequests : pendingRequests;

  const filtradas =
    activeTab === "Todo"
      ? currentRequests
      : currentRequests.filter((n) => {
          if (activeTab === "Citas") return n.RequestType === "schedule_appointment";
          if (activeTab === "Cancelación") return n.RequestType === "cancel_event";
          if (activeTab === "Documento") return n.RequestType === "document_change";
          return true;
        });

  return (
    <div className="contratos-container">
      <HeaderAdm />
      <div className="notificaciones-container">
        <div className="header-notificaciones">
          <h1 className="titulo">Notificaciones</h1>
          <div className="toggle-section">
            <button
              className={`toggle-btn ${!showManaged ? "active" : ""}`}
              onClick={() => setShowManaged(false)}
            >
              Pendientes ({pendingRequests.length})
            </button>
            <button
              className={`toggle-btn ${showManaged ? "active" : ""}`}
              onClick={() => setShowManaged(true)}
            >
              Gestionadas ({managedRequests.length})
            </button>
          </div>
        </div>

        <div className="tabs">
          {["Todo", "Citas", "Cancelación", "Documento"].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="lista">
          {loading ? (
            <p>Cargando...</p>
          ) : filtradas.length === 0 ? (
            <p>No hay notificaciones {showManaged ? "gestionadas" : "pendientes"}</p>
          ) : (
            filtradas.map((n) => (
              <div
                key={n.RequestId}
                className={`card ${n.RequestStatus !== "pending" ? `card-${n.RequestStatus}` : ""}`}
                data-status={n.RequestStatus}
              >
                <h2>{translateRequestType(n.RequestType)}</h2>
                <p>{n.RequestDescription}</p>
                <p className={`estado estado-${n.RequestStatus}`}>
                  Estado: {translateStatus(n.RequestStatus)}
                </p>
                
                <p className="fecha-gestion">
                  Fecha de solicitud: {new Date(n.RequestDate).toLocaleString("es-ES")}
                </p>
                
                {n.RequestStatus === "pending" && (
                  <div className="acciones">
                    <button
                      className="btn-primary-custom"
                      onClick={() => handleStatusChange(n.RequestId, "approved")}
                    >
                      Aceptar
                    </button>
                    <button
                      className="btn-secondary-custom"
                      onClick={() => handleStatusChange(n.RequestId, "rejected")}
                    >
                      Rechazar
                    </button>
                  </div>
                )}
                
                {n.ManagementDate && (
                  <p className="fecha-gestion">
                    Gestionada: {new Date(n.ManagementDate).toLocaleString("es-ES")}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Notifications;