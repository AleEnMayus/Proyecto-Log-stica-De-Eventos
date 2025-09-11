import React, { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import HeaderCl from "../../components/HeaderSidebar/HeaderCl";
import '../CSS/components.css';
import "../CSS/FormsUser.css";

const Schedule = () => {
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");

  const navigate = useNavigate();

  const enviarSolicitud = (e) => {
    e.preventDefault();
    console.log("Solicitud enviada:", { fecha, hora, motivo });
    alert("✅ Tu cita ha sido enviada correctamente");
    setFecha("");
    setHora("");
    setMotivo("");
  };

  const cancel = () => {
    navigate(`/EventsHome`);

  }

  return (
    <div>
      <HeaderCl />

      <div className="login-container">
        <div className="login-content">
          <div className="form-container-custom">
            <h2 className="login-title">Agendar Cita</h2>
            <p className="login-subtitle">
              Selecciona fecha, hora y motivo de tu cita
            </p>

            <form onSubmit={enviarSolicitud}>
              {/* Fecha */}
              <div className="form-group">
                <label htmlFor="fecha" className="form-label">
                  Fecha de la cita
                </label>
                <input
                  type="date"
                  id="fecha"
                  className="form-input"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                />
              </div>

              {/* Hora */}
              <div className="form-group">
                <label htmlFor="hora" className="form-label">
                  Hora de la cita
                </label>
                <input
                  type="time"
                  id="hora"
                  className="form-input"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  required
                />
              </div>

              {/* Motivo */}
              <div className="form-group">
                <label htmlFor="motivo" className="form-label">
                  Motivo
                </label>
                <textarea
                  id="motivo"
                  className="form-input"
                  style={{ minHeight: "100px", resize: "none" }}
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Escriba el motivo de la cita"
                  required
                />
              </div>

              {/* Acciones */}
              <div className="form-actions">
                <button onClick={cancel} type="button" className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-secondary-custom">
                  Enviar solicitud
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;