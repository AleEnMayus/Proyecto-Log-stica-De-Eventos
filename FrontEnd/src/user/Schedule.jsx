import React, { useState } from "react";
import "./Client.css"; // Importa el CSS separado
import HeaderCl from "../components/HeaderCl"; // ya lo tienes

const Schedule = () => {
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");

  const enviarSolicitud = (e) => {
    e.preventDefault();
    console.log("Solicitud enviada:", { fecha, hora, motivo });
    alert("✅ Tu cita ha sido enviada correctamente");
    setFecha("");
    setHora("");
    setMotivo("");
  };

  return (
    <div>
      <HeaderCl />

      <div className="schedule-container">
        <h2 className="schedule-title">Agendar Cita</h2>

        <form className="schedule-form" onSubmit={enviarSolicitud}>
          {/* Fecha */}
          <label htmlFor="fecha">Fecha que desea la cita</label>
          <input
            type="date"
            id="fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />

          {/* Hora */}
          <label htmlFor="hora">Hora que desea la cita</label>
          <input
            type="time"
            id="hora"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            required
          />

          {/* Motivo */}
          <label htmlFor="motivo">Motivo</label>
          <textarea
            id="motivo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Escriba el motivo de la cita"
            required
          />

          {/* Botón */}
          <button type="submit" className="btn-submit">
            Enviar solicitud
          </button>
        </form>
      </div>
    </div>
  );
};

export default Schedule;
