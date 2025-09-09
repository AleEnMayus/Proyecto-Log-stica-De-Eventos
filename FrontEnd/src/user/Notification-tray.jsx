import React, { useState } from "react";
import HeaderCl from "../components/HeaderCl";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("Todo");

  // Simulamos notificaciones
  const notificaciones = [
    {
      id: 1,
      categoria: "Citas",
      titulo: "Señor Cliente",
      descripcion:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 2,
      categoria: "Cancelación",
      titulo: "Señor Cliente",
      descripcion:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
      id: 3,
      categoria: "Documento",
      titulo: "Señor Cliente",
      descripcion:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    },
  ];

  // Filtrar notificaciones
  const filtradas =
    activeTab === "Todo"
      ? notificaciones
      : notificaciones.filter((n) => n.categoria === activeTab);

  return (
    <div className="contratos-container">
      {/* 🔹 Header como en las otras páginas */}
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

        {/* Lista de notificaciones */}
        <div className="lista">
          {filtradas.map((n) => (
            <div key={n.id} className="card">
              <h2>{n.titulo}</h2>
              <p>{n.descripcion}</p>
              <button className="btn">Ver Correo Electrónico</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
