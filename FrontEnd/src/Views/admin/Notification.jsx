import React, { useState, useEffect } from "react";
import HeaderCl from "../../components/HeaderSidebar/HeaderCl";
import { eraseUnderscore } from "../../utils/FormatText";
import "../CSS/Notification.css";

const baseURL = "http://localhost:4000";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("Todo");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar notificaciones desde API
  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Cambiar estado de solicitud
  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${baseURL}/api/requests/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Error al actualizar estado");
      const updated = await res.json();

      // Actualizamos en el estado local
      setRequests((prev) =>
        prev.map((r) => (r.RequestId === id ? { ...r, RequestStatus: status } : r))
      );
    } catch (err) {
      console.error("Error al actualizar estado:", err);
    }
  };

  // Filtro por tabs
  const filtradas =
    activeTab === "Todo"
      ? requests
      : requests.filter((n) => {
          if (activeTab === "Citas") return n.RequestType === "schedule_appointment";
          if (activeTab === "Cancelación") return n.RequestType === "cancel_event";
          if (activeTab === "Documento") return n.RequestType === "document_change";
          return true;
        });

  return (
    <div className="contratos-container">
      <HeaderCl />

      <div className="notificaciones-container">
        <h1 className="titulo">Notificaciones</h1>

        {/* Tabs */}
        <div className="tabs">
          {["Todo", "Citas", "Cancelación", "Documento"].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Lista */}
        <div className="lista">
          {loading ? (
            <p>Cargando...</p>
          ) : filtradas.length === 0 ? (
            <p>No hay notificaciones</p>
          ) : (
            filtradas.map((n) => (
              <div key={n.RequestId} className="card">
                <h2>{eraseUnderscore(n.RequestType)}</h2>
                <p>{n.RequestDescription}</p>
                <p className="estado">Estado: {n.RequestStatus}</p>

                {n.RequestStatus === "pending" && (
                  <div className="acciones">
                    <button
                      className="btn-aceptar"
                      onClick={() => handleStatusChange(n.RequestId, "selected")}
                    >
                      Aceptar
                    </button>
                    <button
                      className="btn-rechazar"
                      onClick={() => handleStatusChange(n.RequestId, "rejected")}
                    >
                      Rechazar
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;