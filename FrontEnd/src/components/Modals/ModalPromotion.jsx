import React from "react";

const PromotionModal = ({ promo, onClose }) => {
  if (!promo) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
    >
      <div
        className="modal-content bg-white p-4 rounded-4 shadow-lg"
        style={{
          maxWidth: "450px",
          width: "90%",
          animation: "fadeIn 0.3s ease",
        }}
      >
        <h3 className="text-primary mb-3 fw-bold">{promo.titulo}</h3>
        <p className="mb-2">
          <strong>Nombre:</strong> {promo.nombre}
        </p>
        <p className="mb-2">
          <strong>Descripción:</strong> {promo.descripcion}
        </p>
        <p className="fw-bold mb-3" style={{ color: "rgb(255, 83, 121)" }}>
          <strong>Valor: {promo.valor}</strong>
        </p>

        <div className="text-end">
          <button
            className="btn-secondary-custom"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromotionModal;
