import React, { useState } from "react";
import "./CSS/Modals.css";

const RequestModal = ({ isOpen, onClose, user, requestType }) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const stop = (e) => e.stopPropagation();

  const SendReason = () => {
    if (reason.trim()) {
      // Aquí puedes conectar con tu API en vez de console.log
      console.log("Solicitud enviada:", {
        userId: user?.id,
        requestType,
        reason,
        date: new Date().toISOString(),
      });
      onClose();
    }
  };

  // Diccionario de configuración
  const requestConfig = {
    schedule_appointment: {
      title: "Solicitud de agendamiento de cita",
      placeholder: "Indique la fecha, hora y motivo de la cita...",
    },
    cancel_event: {
      title: "Solicitud de cancelación de evento",
      placeholder: "Explique el motivo por el cual desea cancelar el evento...",
    },
    document_change: {
      title: "Solicitud de cambio de documento",
      placeholder: "Escriba el documento y por qué desea cambiarlo...",
    },
  };

  // Configuración según tipo
  const config = requestConfig[requestType] || {
    title: "Nueva Solicitud",
    placeholder: "Describa su solicitud...",
  };

  return (
    <>
      <div className="sidebar-overlay active" onClick={onClose}>
        <div
          className="profile-modal w-80 position-absolute top-50 start-50 translate-middle"
          onClick={stop}
          role="dialog"
          aria-modal="true"
        >
          <button className="close-btn" aria-label="Cerrar" onClick={onClose}>
            ×
          </button>

          <h4 className="modal-title text-center mb-3">{config.title}</h4>

          <div className="pm-body">
            <div className="field-row w-100">
              <div className="field">
                <div className="field-label">Motivo</div>
                <textarea
                  className="field-value w-100 min-h-200px"
                  placeholder={config.placeholder}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  maxLength={100}
                />
              </div>
            </div>
          </div>

          <div className="text-start small text-muted mt-0 mb-3">
            {100 - reason.length} caracteres restantes
          </div>

          <button className="btn-primary-custom w-100" onClick={SendReason}>
            Enviar
          </button>
        </div>
      </div>
    </>
  );
};

export default RequestModal;