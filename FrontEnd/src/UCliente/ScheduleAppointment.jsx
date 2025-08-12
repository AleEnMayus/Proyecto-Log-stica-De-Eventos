import React, { useState } from "react";
import "./Client.css"; // Importa el CSS separado
import HeaderCl from "../components/HeaderCl";

const ScheduleAppointment = () => {
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");

  const enviarSolicitud = (e) => {
    e.preventDefault();
    console.log({ fecha, hora, motivo });
    alert("Solicitud enviada");
  };

  return (
    <div className="cita-container">
      <form className="cita-card promo-card" onSubmit={enviarSolicitud}>
        <h2 className="section-title">Agendar Cita</h2>


        <label htmlFor="fecha">Fecha que desea la cita</label>
        <input
          type="date"
          id="fecha"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />

        <label htmlFor="hora">Hora que desea la cita</label>
        <input
          type="time"
          id="hora"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          required
        />

        <label htmlFor="motivo">Motivo</label>
        <textarea
          id="motivo"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          rows="4"
          required
        ></textarea>

        <button type="submit" className="btn-primary-custom w-100">
          Enviar solicitud
        </button>
      </form>
    </div>
  );
};

export default ScheduleAppointment;
