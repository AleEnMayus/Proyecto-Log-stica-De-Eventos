import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "../../../Views/CSS/Modals.css";
import RequestModal from '../RequestModal';

// ✅ Importar el hook y el contenedor de toasts
import { useToast } from "../../../hooks/useToast";
import ToastContainer from "../../../components/ToastContainer";

const API_FIELD_MAPPING = {
  fullName: "Names",
  birthDate: "BirthDate",
  photo: "Photo",
  identificationType: "DocumentType",
  documentNumber: "DocumentNumber",
};

const EditModal = ({ isOpen, onClose, user, onSave }) => { 
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast(); // ✅ sistema de notificaciones

  const [isRequestModalOpen, setRequestModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [originalUser, setOriginalUser] = useState({});
  const [errors, setErrors] = useState({});

  // Efecto inicial
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const initialData = {
          fullName: parsedUser.fullName || parsedUser.Names || "",
          email: parsedUser.email || parsedUser.Email || "",
          birthDate: parsedUser.birthDate
            ? parsedUser.birthDate.split("T")[0]
            : parsedUser.BirthDate
            ? parsedUser.BirthDate.split("T")[0]
            : "",
          identificationType:
            parsedUser.identificationType || parsedUser.DocumentType || "",
          documentNumber:
            parsedUser.documentNumber || parsedUser.DocumentNumber || "",
          photo: parsedUser.photo || parsedUser.Photo || parsedUser.profilePicture || "",
        };

        setFormData(initialData);
        setOriginalUser(initialData);
      } catch (err) {
        console.error("⚠️ Error al parsear user de localStorage:", err);
      }
    }
  }, []);

  if (!isOpen) return null;

  const stopPropagation = (e) => e.stopPropagation();
  const role = user?.role || "user";
  const rolLegible = role === "admin" ? "Administrador" : "Cliente";

  // Validaciones
  const validateField = (name, value) => {
    let error = "";

    if (name === "fullName" && (!value || value.trim().length < 3)) {
      error = "El nombre debe tener al menos 3 caracteres.";
    }

    if (name === "documentNumber" && value && !/^[0-9]+$/.test(value)) {
      error = "El número de documento debe contener solo números.";
    }

    if (name === "photo" && value && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(value)) {
      error = "La URL debe ser una imagen válida.";
    }

    if (name === "birthDate" && value) {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();

      const isMinor =
        age < 18 ||
        (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)));

      if (isMinor) {
        error = "Debes ser mayor de edad (mínimo 18 años).";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // Guardar cambios
  const handleSaveChanges = async () => {
    try {
      // ✅ Validar antes de enviar
      Object.keys(formData).forEach((key) => validateField(key, formData[key]));
      const hasErrors = Object.values(errors).some((err) => err);

      // ✅ Validar campos obligatorios
      const requiredFields = ["fullName", "birthDate", "identificationType", "documentNumber"];
      const emptyFields = requiredFields.filter(
        (f) => !formData[f] || formData[f].trim() === ""
      );

      if (emptyFields.length > 0) {
        addToast("Por favor, completa todos los campos obligatorios antes de guardar.", "danger");
        return;
      }

      if (hasErrors) {
        addToast("Por favor, corrige los errores antes de guardar.", "danger");
        return;
      }

      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        addToast("No se encontró información del usuario.", "danger");
        onClose();
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.id;
      if (!userId) {
        addToast("No se pudo encontrar el ID del usuario.", "danger");
        onClose();
        return;
      }

      const changes = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== originalUser[key]) {
          const apiFieldName = API_FIELD_MAPPING[key];
          if (apiFieldName) {
            changes[apiFieldName] = formData[key];
          }
        }
      });

      if (Object.keys(changes).length === 0) {
        addToast("No se detectaron cambios para guardar.", "warning");
        onClose();
        return;
      }

      // 📨 Enviar actualización
      const response = await fetch(`http://localhost:4000/api/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });

      if (response.ok) {
        const updatedUser = { ...parsedUser, ...formData };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        addToast("Perfil actualizado correctamente.", "success");

        if (onSave) onSave(updatedUser);
        setOriginalUser(formData);

        setTimeout(() => onClose(), 2000); // Cierra después del mensaje
      } else {
        const errorData = await response.json();
        addToast(errorData.message || "Error al actualizar el perfil.", "danger");
      }
    } catch (error) {
      console.error("Error de red o conexión:", error);
      addToast("Error de conexión con el servidor.", "danger");
    }
  };

  const openRequestModal = () => setRequestModalOpen(true);
  const closeRequestModal = () => setRequestModalOpen(false);

  return (
    <>
      <div className="sidebar-overlay active" onClick={onClose}>
        <div className="profile-modal w-800" onClick={stopPropagation}>
          <button className="close-btn" onClick={onClose}>×</button>
          <h4 className="modal-title text-center mb-3">Editar Perfil</h4>

          <div className="pm-body d-flex flex-wrap">
            {/* Foto */}
            <div className="pm-photo">
              {formData.photo ? (
                <img
                  src={formData.photo}
                  alt="Avatar del usuario"
                  className="img-pf rounded-circle"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextElementSibling.style.display = "block";
                  }}
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#0e40b68b">
                  <path d="M222-255q63-40 124.5-60.5T480-336q72 0 134 20.5T739-255q44-54 62.5-109T820-480q0-145-97.5-242.5T480-820q-145 0-242.5 97.5T140-480q0 61 19 116t63 109Zm257.81-195q-57.81 0-97.31-39.69-39.5-39.68-39.5-97.5 0-57.81 39.69-97.31 39.68-39.5 97.5-39.5 57.81 0 97.31 39.69 39.5 39.68 39.5 97.5 0 57.81-39.69 97.31-39.68 39.5-97.5 39.5Zm-.21 370q-83.15 0-156.28-31.5t-127.22-86Q142-252 111-324.84 80-397.68 80-480.5t31.5-155.66Q143-709 197.5-763t127.34-85.5Q397.68-880 480.5-880t155.66 31.5Q709-817 763-763t85.5 127Q880-563 880-480.27q0 82.74-31.5 155.5Q817-252 763-197.5t-127.13 86Q562.74-80 479.6-80Z" />
                </svg>
              )}
            </div>

            {/* Campos */}
            <div className="pm-fields" style={{ maxWidth: "800px" }}>
              <div className="field-row">
                <div className="field">
                  <div className="badge bg-secondary small mt-3">{rolLegible}</div>
                </div>
              </div>

              {/* Campos de usuario */}
              <div className="field-row">
                <div className="field">
                  <div className="field-label">Nombre completo *</div>
                  <input
                    type="text"
                    name="fullName"
                    className="field-value"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                  {errors.fullName && <small className="error-text">{errors.fullName}</small>}
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <div className="field-label">
                    Correo <span className="text-muted ms-2">(Campo protegido)</span>
                  </div>
                  <input
                    type="email"
                    name="email"
                    className="field-value field-disabled"
                    value={formData.email}
                    disabled
                  />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <div className="field-label">Fecha de nacimiento *</div>
                  <input
                    type="date"
                    name="birthDate"
                    className="field-value"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                  />
                  {errors.birthDate && <small className="error-text">{errors.birthDate}</small>}
                </div>
              </div>

              <div className="field-row two-cols">
                <div className="field">
                  <div className="field-label">
                    Tipo de documento *
                    {role === "user" && <span className="text-muted ms-2">(Campo protegido)</span>}
                  </div>
                  <select
                    name="identificationType"
                    className={`field-value ${role === "user" ? "field-disabled" : ""}`}
                    value={formData.identificationType}
                    onChange={handleInputChange}
                    disabled={role === "user"}
                  >
                    <option value="">Seleccionar</option>
                    <option value="CC">Cédula de Ciudadanía</option>
                    <option value="CE">Cédula de Extranjería</option>
                    <option value="PP">Pasaporte</option>
                  </select>
                </div>

                <div className="field">
                  <div className="field-label">
                    Número de documento *
                    {role === "user" && <span className="text-muted ms-2">(Campo protegido)</span>}
                  </div>
                  <input
                    type="text"
                    name="documentNumber"
                    className={`field-value ${role === "user" ? "field-disabled" : ""}`}
                    value={formData.documentNumber}
                    onChange={handleInputChange}
                    disabled={role === "user"}
                  />
                  {errors.documentNumber && <small className="error-text">{errors.documentNumber}</small>}
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <div className="field-label">URL de foto (opcional)</div>
                  <input
                    type="url"
                    name="photo"
                    className="field-value"
                    value={formData.photo}
                    onChange={handleInputChange}
                    placeholder="https://ejemplo.com/foto.jpg"
                  />
                  {errors.photo && <small className="error-text">{errors.photo}</small>}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pm-footer d-flex flex-column gap-2">
            <button className="btn-primary-custom w-100" onClick={handleSaveChanges}>
              Guardar Cambios
            </button>

            <button
              className="btn-secondary-custom w-100"
              onClick={() => {
                onClose();
                navigate("/updatePassword");
              }}
            >
              Cambiar contraseña
            </button>

            {role === "user" && (
              <button className="btn-secondary-custom w-100" onClick={() => setRequestModalOpen(true)}>
                Solicitar cambio de documento
              </button>
            )}
          </div>
        </div>
      </div>

      {isRequestModalOpen && (
        <RequestModal
          isOpen={isRequestModalOpen}
          onClose={() => setRequestModalOpen(false)}
          user={user}
          requestType="document_change"
        />
      )}

      {/* ✅ Contenedor de notificaciones */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
};

export default EditModal;
