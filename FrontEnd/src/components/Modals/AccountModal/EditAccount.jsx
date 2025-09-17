import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "../../../Views/CSS/Modals.css";
import RequestModal from '../RequestModal';

const API_FIELD_MAPPING = {
  fullName: "Names",
  birthDate: "BirthDate",
  photo: "Photo",
  identificationType: "DocumentType",
  documentNumber: "DocumentNumber",
};

const EditModal = ({ isOpen, onClose, user }) => {
  const navigate = useNavigate();

  // Estados del modal de solicitud de documento
  const [isRequestModalOpen, setRequestModalOpen] = useState(false);

  // Estados para los campos del formulario
  const [formData, setFormData] = useState({});
  const [originalUser, setOriginalUser] = useState({});

  // EFECTO: Cargar datos de localStorage y rellenar formulario
  useEffect(() => {
    const storedUser = localStorage.getItem("user"); //  usamos la misma clave que en LoginPage

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
    } else {
      console.warn("⚠️ No se encontró información del usuario en localStorage.");
    }
  }, []);

  if (!isOpen) return null;

  const stopPropagation = (e) => e.stopPropagation();

  const role = user?.role || "user"; // fallback por si no viene el rol
  const rolLegible = role === "admin" ? "Administrador" : "Cliente";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
  // ✅ Ahora busca el objeto correcto
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    console.error("No se encontró información de usuario en localStorage.");
    onClose();
    return;
  }

  const user = JSON.parse(storedUser);

  // ✅ El ID está como "id", no "UserId"
  const userId = user.id;
  if (!userId) {
    console.error("No se pudo encontrar el ID de usuario para actualizar el perfil.");
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
    console.log("No se detectaron cambios.");
    onClose();
    return;
  }

  try {
    const response = await fetch(`http://localhost:4000/api/profile/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    });

    if (response.ok) {
      console.log("Perfil actualizado correctamente.");

      //  Combinar cambios con el user original
      const updatedUser = { ...user, ...formData };
      localStorage.setItem("userData", JSON.stringify(updatedUser));
      setOriginalUser(formData);

      onClose();
    } else {
      const errorData = await response.json();
      console.error("Error de la API al actualizar el perfil:", errorData.message);
    }
  } catch (error) {
    console.error("Error de red o conexión:", error);
  }
};


  const openRequestModal = () => setRequestModalOpen(true);
  const closeRequestModal = () => setRequestModalOpen(false);

  return (
    <>
      <div className="sidebar-overlay active" onClick={onClose}>
        <div
          className="profile-modal"
          onClick={stopPropagation}
          role="dialog"
          aria-modal="true"
        >
          <button className="close-btn" aria-label="Cerrar" onClick={onClose}>
            ×
          </button>

          <h4 className="modal-title text-center mb-3">Editar Perfil</h4>

          <div className="pm-body d-flex flex-wrap">
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

              {/* Nombre completo */}
              <div className="field-row">
                <div className="field">
                  <div className="field-label">
                    Nombre completo
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    className="field-value"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Correo */}
              <div className="field-row">
                <div className="field">
                  <div className="field-label">
                    Correo
                    <span className="text-muted ms-2">(Campo protegido)</span>
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

              {/* Fecha de nacimiento */}
              <div className="field-row">
                <div className="field">
                  <div className="field-label">Fecha de nacimiento</div>
                  <input
                    type="date"
                    name="birthDate"
                    className="field-value"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Documento */}
              <div className="field-row two-cols">
                <div className="field">
                  <div className="field-label">
                    Tipo de documento
                    {role === "user" && (
                      <span className="text-muted ms-2">(Campo protegido)</span>
                    )}
                  </div>
                  <select
                    name="identificationType"
                    className={`field-value ${
                      role === "user" ? "field-disabled" : ""
                    }`}
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
                    Número de documento
                    {role === "user" && (
                      <span className="text-muted ms-2">(Campo protegido)</span>
                    )}
                  </div>
                  <input
                    type="text"
                    name="documentNumber"
                    className={`field-value ${
                      role === "user" ? "field-disabled" : ""
                    }`}
                    value={formData.documentNumber}
                    onChange={handleInputChange}
                    disabled={role === "user"}
                  />
                </div>
              </div>

              {/* Foto */}
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
                </div>
              </div>
            </div>
          </div>

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
              <button
                className="btn-secondary-custom w-100"
                onClick={openRequestModal}
              >
                Solicitar cambio de documento
              </button>
            )}
          </div>
        </div>
      </div>

      {isRequestModalOpen && (
        <RequestModal
          isOpen={isRequestModalOpen}
          onClose={closeRequestModal}
          user={user}
          requestType="document_change"
        />
      )}
    </>
  );
};

export default EditModal;