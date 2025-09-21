import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import HeaderCl from "../../components/HeaderSidebar/HeaderCl";
import '../CSS/components.css';
import "../CSS/FormsUser.css";

const Schedule = () => {
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");
  const navigate = useNavigate();

  // Validar que la fecha sea válida (no antes de hoy, ni fuera de rango lógico)
  const validarFecha = (fechaSeleccionada) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // resetear hora a inicio del día
    const fechaIngresada = new Date(fechaSeleccionada);

    if (fechaIngresada < hoy) {
      alert("No puedes seleccionar una fecha anterior a hoy.");
      return false;
    }

    const year = fechaIngresada.getFullYear();
    if (year < 1900 || year > 2100) {
      alert("Por favor selecciona una fecha válida.");
      return false;
    }

    return true;
  };

  const enviarSolicitud = async (e) => {
    e.preventDefault();

    if (!validarFecha(fecha)) {
      return;
    }

    try {
      // Combinar fecha y hora en formato ISO
      const fechaHora = `${fecha}T${hora}:00`;

      const response = await fetch("http://localhost:4000/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          RequestDate: fechaHora,
          RequestDescription: motivo,
          RequestType: "schedule_appointment", 
          UserId: 1, // aquí deberías poner el id del usuario logueado
          EventId: null 
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Tu cita ha sido enviada correctamente");
        console.log("Solicitud creada:", data);
        setFecha("");
        setHora("");
        setMotivo("");
        navigate("/EventsHome");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Hubo un problema al enviar la solicitud");
    }
  };

  const cancel = () => {
    navigate(`/EventsHome`);
  };

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
              {/* Campo de fecha */}
              <div className="form-group">
                <label htmlFor="fecha" className="form-label">Fecha de la cita</label>
                <input
                  type="date"
                  id="fecha"
                  className="form-input"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                />
              </div>

              {/* Campo de hora */}
              <div className="form-group">
                <label htmlFor="hora" className="form-label">Hora de la cita</label>
                <input
                  type="time"
                  id="hora"
                  className="form-input"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  required
                />
              </div>

              {/* Campo de motivo */}
              <div className="form-group">
                <label htmlFor="motivo" className="form-label">Motivo</label>
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

              {/* Botones de acción */}
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