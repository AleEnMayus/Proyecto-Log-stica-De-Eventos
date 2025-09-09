import React, { useState, useEffect } from 'react';
import "../Views/CSS/Modals.css";

const ModalState = ({ 
  show, 
  onClose, 
  onConfirm,    // recibe la acción confirmada
  currentStatus, 
  entityId,     // id del usuario/evento que quieres modificar
  options = ["En planeación", "En ejecución", "Finalizado"], 
  title = "Cambiar estado"
}) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  useEffect(() => {
    setSelectedStatus(currentStatus); // resetea al abrir el modal
  }, [currentStatus, show]);

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
  };

  const handleStatusChange = () => {
    if (selectedStatus) {
      onConfirm(entityId, selectedStatus); // envía id + nuevo estatus
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div className="sidebar-overlay active">
      <div className="profile-modal w-50 position-absolute top-50 start-50 translate-middle">
        <button className="close-btn" onClick={onClose}>×</button>

        <h2 className="modal-title text-center">{title}</h2>

        {/* Opciones de estados */}
        <div className="status-options d-flex flex-column text-center">
          {options.slice(0, 3).map((status) => (
            <div
              key={status}
              onClick={() => handleStatusSelect(status)}
              className={`status-option ${selectedStatus === status ? "selected" : ""}`}
            >
              <div className="status-box">
                {selectedStatus === status && <span className="checkmark">✓</span>}
              </div>
              <span className="status-label">{status}</span>
            </div>
          ))}
        </div>

        <div className="pm-footer">
          <button className="btn btn-status w-100" onClick={onClose}>Cancelar</button>
          <button 
            onClick={handleStatusChange}
            disabled={!selectedStatus}
            className="btn-primary-custom w-100"
          >
            Cambiar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalState;