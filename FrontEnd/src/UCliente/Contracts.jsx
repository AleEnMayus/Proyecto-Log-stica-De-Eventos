import React from "react";
import "./Client.css"; // Importa el CSS separado
import HeaderCl from "../components/HeaderCl";

const Contracts = () => {
  // 🔹 Simulamos que el usuario ya inició sesión
  const user = {
    name: "Juan", // Puedes poner el nombre del cliente logueado
  };

  return (
    <div className="contratos-container">
      {/* 👇 Pasamos el user al Header */}
      <HeaderCl user={user} />

      {/* Enviar Contrato */}
      <div className="promo-card contratos-card">
        <h3>Enviar Contrato</h3>

        <label htmlFor="eventoEnviar">Evento</label>
        <select id="eventoEnviar" className="dropdown form-control">
          <option>Dropdown</option>
        </select>

        <label htmlFor="archivoEnviar">Eliminar Contrato</label>
        <div className="input-group-custom">
          <input type="text" id="archivoEnviar" value="CONTRATO.P" readOnly />
          <span className="icon-btn">📂</span>
        </div>

        <button className="btn-primary-custom w-100">Enviar Contrato</button>
      </div>

      {/* Eliminar Contrato */}
      <div className="promo-card contratos-card">
        <h3>Eliminar Contrato</h3>

        <label htmlFor="eventoEliminar">Evento</label>
        <select id="eventoEliminar" className="dropdown form-control">
          <option>Dropdown</option>
        </select>

        <label htmlFor="archivoEliminar">Eliminar Contrato</label>
        <div className="input-group-custom">
          <input type="text" id="archivoEliminar" value="CONTRATO.P" readOnly />
          <span className="icon-btn">👁</span>
        </div>

        <button className="btn-secondary-custom w-100">Eliminar</button>
      </div>
    </div>
  );
};

export default Contracts;
