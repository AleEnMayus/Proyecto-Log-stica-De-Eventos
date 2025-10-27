import React, { useState, useEffect } from "react";
import HeaderAdm from "../../../components/HeaderSidebar/HeaderAdm";
import "../../CSS/FormsUser.css";
import ToastContainer from "../../../components/ToastContainer";
import { useToast } from "../../../hooks/useToast";

const EditAccountPage = ({ userData, onClose }) => {
  const { toasts, showToast, removeToast } = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    birthDate: "",
    documentType: "",
    documentNumber: "",
    rol: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // agregado

  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        email: userData.email || "",
        birthDate: userData.birthDate || "",
        documentType: userData.documentType || "",
        documentNumber: userData.documentNumber || "",
        rol: userData.rol || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "El nombre es obligatorio";
    if (!formData.email) newErrors.email = "El correo es obligatorio";
    if (!formData.documentType)
      newErrors.documentType = "Seleccione un tipo de documento";
    if (!formData.documentNumber)
      newErrors.documentNumber = "El número de documento es obligatorio";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      showToast("Cuenta actualizada correctamente", "success");
      onClose && onClose();
    }
  };

  const handleCancel = () => {
    onClose && onClose();
  };

  return (
    <>
      <HeaderAdm />
      <div className="login-container" style={{ paddingTop: "100px" }}>
        <div className="form-container form-container-custom">
          <h2 className="form-page-title">EDITAR CUENTA</h2>


          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {/* 🔹 Fila 1: Nombre y Correo */}
            <div className="form-row">
              <div className="form-col">
                <label className="form-label">Nombre completo</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-input"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                {errors.firstName && (
                  <p className="text-danger">{errors.firstName}</p>
                )}
              </div>
              <div className="form-col">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && <p className="text-danger">{errors.email}</p>}
              </div>
            </div>

            {/* 🔹 Fila 2: Fecha y Tipo de documento */}
            <div className="form-row">
              <div className="form-col">
                <label className="form-label">Fecha de nacimiento</label>
                <input
                  type="date"
                  name="birthDate"
                  className="form-input"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                />
                {errors.birthDate && (
                  <p className="text-danger">{errors.birthDate}</p>
                )}
              </div>
              <div className="form-col">
                <label className="form-label">Tipo de documento</label>
                <select
                  name="documentType"
                  className="form-input"
                  value={formData.documentType}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccione</option>
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="Pasaporte">Pasaporte</option>
                </select>
                {errors.documentType && (
                  <p className="text-danger">{errors.documentType}</p>
                )}
              </div>
            </div>

            {/* 🔹 Fila 3: Número de documento y Rol */}
            <div className="form-row">
              <div className="form-col">
                <label className="form-label">Número de documento</label>
                <input
                  type="text"
                  name="documentNumber"
                  className="form-input"
                  value={formData.documentNumber}
                  onChange={handleInputChange}
                />
                {errors.documentNumber && (
                  <p className="text-danger">{errors.documentNumber}</p>
                )}
              </div>
              <div className="form-col">
                <label className="form-label">Rol</label>
                <select
                  name="rol"
                  className="form-input"
                  value={formData.rol}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccione</option>
                  <option value="admin">Administrador</option>
                  <option value="client">Cliente</option>
                </select>
                {errors.rol && <p className="text-danger">{errors.rol}</p>}
              </div>
            </div>

            {/* 🔹 Fila 4: Contraseña y Confirmación */}
            <div className="form-row">
              <div className="form-col">
                <label className="form-label">Contraseña</label>
                <div className="input-with-icon">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-input"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <span
                    className="toggle-visibility-inside"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.07 21.07 0 0 1 5.06-6.06" />
                        <path d="M1 1l22 22" />
                      </svg>
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-danger">{errors.password}</p>
                )}
              </div>

              <div className="form-col">
                <label className="form-label">Confirmar contraseña</label>
                <div className="input-with-icon">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="form-input"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  <span
                    className="toggle-visibility-inside"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.07 21.07 0 0 1 5.06-6.06" />
                        <path d="M1 1l22 22" />
                      </svg>
                    )}
                  </span>
                </div>
                {errors.confirmPassword && (
                  <p className="text-danger">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* 🔹 Botones */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary-custom">
                Actualizar Cuenta
              </button>
            </div>
          </form>

          {/* 🔹 Toast */}
          <ToastContainer
            toasts={toasts || []}
            removeToast={removeToast || (() => {})}
          />
        </div>
      </div>
    </>
  );
};

export default EditAccountPage;