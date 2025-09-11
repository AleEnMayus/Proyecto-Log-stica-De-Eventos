import React from "react";
import "../../Views/CSS/Modals.css";

const ConfirmModal = ({ 
  show, 
  onClose, 
  onConfirm, 
  message, 
  confirmText = "Confirmar"
}) => {
  if (!show) return null;

  return (
    <div className="sidebar-overlay active" onClick={onClose}>
      <div className="profile-modal w-80 position-absolute top-50 start-50 translate-middle">
        {/* Botón de cerrar */}
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        {/* Mensaje */}
        <div className="pm-body" style={{ justifyContent: "center" }}>
          <p className="modal-message" style={{ fontWeight: "bold", textAlign: "center" }}>
            {message}
          </p>
        </div>

        {/* Botones */}
        <div className="pm-footer">
          <button className="btn btn-status w-100 " onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary-custom w-100" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
