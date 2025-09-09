import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../Views/CSS/Modals.css";

const PerfilModal = ({ isOpen, onClose, user, onEdit  }) => {
  const navigate = useNavigate();
  
  if (!isOpen) return null;

  const stop = (e) => e.stopPropagation();

  // Sacamos los datos del user que viene del localStorage
  const {
    fullName,
    email,
    birthDate,
    identificationType,
    documentNumber,
    photo,
    role
  } = user || {};

  const rolLegible = role === "admin" ? "Administrador" : "Cliente";
  const onlyDate = birthDate.split("T")[0];

  return (
    <>
      {/* Modal Perfil */}
      <div className="sidebar-overlay active" onClick={onClose}>
        <div
          className="profile-modal"
          onClick={stop}
          role="dialog"
          aria-modal="true"
        >
          <button className="close-btn" aria-label="Cerrar" onClick={onClose}>
            ×
          </button>

          <h4 className="modal-title text-center mb-3">Detalles del Perfil</h4>

          <div className="pm-body d-flex flex-wrap">
            <div className="pm-photo">
              {photo ? (
                <img
                  src={photo}
                  alt="Avatar del usuario"
                  className="img-pf rounded-circle"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextElementSibling.style.display = "block";
                  }}
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="50px"
                  viewBox="0 -960 960 960"
                  width="50px"
                  fill="#0e40b68b"
                >
                  <path d="M222-255q63-40 124.5-60.5T480-336q72 0 134 20.5T739-255q44-54 62.5-109T820-480q0-145-97.5-242.5T480-820q-145 0-242.5 97.5T140-480q0 61 19 116t63 109Zm257.81-195q-57.81 0-97.31-39.69-39.5-39.68-39.5-97.5 0-57.81 39.69-97.31 39.68-39.5 97.5-39.5 57.81 0 97.31 39.69 39.5 39.68 39.5 97.5 0 57.81-39.69 97.31-39.68 39.5-97.5 39.5Zm-.21 370q-83.15 0-156.28-31.5t-127.22-86Q142-252 111-324.84 80-397.68 80-480.5t31.5-155.66Q143-709 197.5-763t127.34-85.5Q397.68-880 480.5-880t155.66 31.5Q709-817 763-763t85.5 127Q880-563 880-480.27q0 82.74-31.5 155.5Q817-252 763-197.5t-127.13 86Q562.74-80 479.6-80Z" />
                </svg>
              )}
            </div>

            <div className="pm-fields">
              <div className="field-row">
                <div className="field">
                  <div className="badge bg-secondary small mt-3">
                    {rolLegible}
                  </div>
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <div className="field-label">Nombre completo</div>
                  <div className="field-value">{fullName}</div>
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <div className="field-label">Correo</div>
                  <div className="field-value">{email}</div>
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <div className="field-label">Fecha de nacimiento</div>
                  <div className="field-value">{onlyDate}</div>
                </div>
              </div>

              <div className="field-row two-cols">
                <div className="field">
                  <div className="field-label">Tipo de documento</div>
                  <div className="field-value">{identificationType}</div>
                </div>
                <div className="field">
                  <div className="field-label">Número de documento</div>
                  <div className="field-value">{documentNumber}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pm-footer">
            <button className="btn-primary-custom w-100"
              onClick={() => {
                onClose();
                onEdit();   // Abre el EditModal desde el padre
              }}>
              Editar perfil
            </button>
            <button
              className="btn-secondary-custom w-100"
              onClick={() => {
                onClose();
                navigate("/logout");
              }}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PerfilModal;
