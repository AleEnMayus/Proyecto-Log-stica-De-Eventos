// account.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import './PerfilModal.css'

const PerfilModal = ({ isOpen, onClose, user, role = "cliente" }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const stop = (e) => e.stopPropagation();

  const nombre = user?.name || "Usuario";
  const email = user?.email || "example@email.com";
  const telefono = user?.phone || "No registrado";
  const fechaNacimiento = user?.birthDate || "01/01/2000";
  const documento = user?.document || "123456789";
  const tipoDocumento = user?.documentType || "Cédula de ciudadanía";
  const rolLegible = role === "admin" ? "Administrador" : "Cliente";

  return (
    <div className="sidebar-overlay active" onClick={onClose}>
      <div className="profile-modal" onClick={stop} role="dialog" aria-modal="true">
        <button className="close-btn" aria-label="Cerrar" onClick={onClose}>
          ×
        </button>

        <h4 className="modal-title text-center mb-3">Detalles del Perfil</h4>

        <div className="pm-body">
          <div className="pm-avatar" aria-hidden />
          <div className="pm-fields">
            <div className="field-row">
              <div className="field">
                <div className="field-label">Nombre de usuario</div>
                <div className="field-value">{nombre}</div>
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <div className="field-label">Correo electrónico</div>
                <div className="field-value">{email}</div>
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <div className="field-label">Número telefónico (Opcional)</div>
                <div className="field-value">{telefono}</div>
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <div className="field-label">Fecha de nacimiento</div>
                <div className="field-value">{fechaNacimiento}</div>
              </div>
            </div>

            <div className="field-row two-cols">
              <div className="field">
                <div className="field-label">Número de documento</div>
                <div className="field-value">{documento}</div>
              </div>
              <div className="field">
                <div className="field-label">Tipo de documento</div>
                <div className="field-value">{tipoDocumento}</div>
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <div className="field-label">Rol</div>
                <div className="field-value">{rolLegible}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="pm-footer">
          <button
            className="btn-primary-custom"
            onClick={() => {
              onClose();
              navigate("/editar-perfil");
            }}
          >
            Editar perfil
          </button>
          <button
            className="btn-secondary-custom"
            onClick={() => {
              onClose();
              navigate("/logout");
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerfilModal;
