import React, { useState } from 'react';
import '../../CSS/FormsUser.css';
import HeaderAdm from '../../../components/HeaderSidebar/HeaderAdm';

const CreateAccountForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    birthDate: '',
    documentType: '',
    documentNumber: '',
    rol: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("Debe tener mínimo 8 caracteres");
    if (!/[A-Z]/.test(password)) errors.push("Debe tener al menos 1 mayúscula");
    if (!/[a-z]/.test(password)) errors.push("Debe tener al menos 1 minúscula");
    if (!/[0-9]/.test(password)) errors.push("Debe tener al menos 1 número");
    if (!/[^A-Za-z0-9]/.test(password)) errors.push("Debe tener al menos 1 caracter especial");
    return errors;
  };

  const handleSubmit = async () => {
    setErrorMessage('');

    // Validar campos obligatorios
    const requiredFields = ['firstName', 'email', 'birthDate', 'documentType', 'documentNumber', 'password', 'confirmPassword'];
    const emptyFields = requiredFields.filter(field => !formData[field]);
    if (emptyFields.length > 0) {
      setErrorMessage('Por favor, completa todos los campos obligatorios.');
      return;
    }

    // Validar edad (mayores de 18)
    const today = new Date();
    const birthDate = new Date(formData.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      setErrorMessage('Debes ser mayor de edad para registrarte.');
      return;
    }

    // Validar contraseña
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      setErrorMessage(passwordErrors.join(', '));
      return;
    }

    // Confirmar contraseña
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Names: formData.firstName,
          DocumentType: formData.documentType,
          DocumentNumber: formData.documentNumber,
          BirthDate: formData.birthDate,
          Email: formData.email,
          Password: formData.password
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        setErrorMessage(errData.message || 'Error al crear la cuenta.');
        return;
      }

      alert('Cuenta creada exitosamente!');
      setFormData({
        firstName: '',
        email: '',
        birthDate: '',
        documentType: '',
        documentNumber: '',
        rol: '',
        password: '',
        confirmPassword: ''
      });

    } catch (error) {
      console.error('Error en la petición:', error);
      setErrorMessage('Error en el servidor, intenta más tarde.');
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: '',
      email: '',
      birthDate: '',
      documentType: '',
      documentNumber: '',
      rol: '',
      password: '',
      confirmPassword: ''
    });
    setErrorMessage('');
  };

  return (
    <>
      <HeaderAdm />
      <div className="login-container">
        <div className="login-content">
          <div className="login-form-card" style={{ maxWidth: "800px" }}>
            <h1 className="login-title">CREAR CUENTA</h1>

            {errorMessage && (
              <p className="text-danger" style={{ color: "red", marginBottom: "10px" }}>
                {errorMessage}
              </p>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <div className="row">
                <div className="col-md-12 mb-3">
                  <label className="form-label">
                    Nombre completo <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    className="form-input"
                    placeholder="Ingresa tu nombre completo"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Correo electrónico <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="ejemplo@correo.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Fecha de nacimiento <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    className="form-input"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Tipo de documento <span className="text-danger">*</span>
                  </label>
                  <select
                    name="documentType"
                    className="form-input"
                    value={formData.documentType}
                    onChange={handleInputChange}
                  >
                    <option value="">Elige tipo</option>
                    <option value="CC">Cédula de Ciudadanía</option>
                    <option value="CE">Cédula de Extranjería</option>
                    <option value="Pasaporte">Pasaporte</option>
                    <option value="TI">Tarjeta de Identidad</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Número de documento <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="documentNumber"
                    className="form-input"
                    placeholder="Ej: 1234567890"
                    value={formData.documentNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Contraseña <span className="text-danger">*</span>
                  </label>
                  <div className="input-with-icon">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="form-input d-flex align-items-center"
                      placeholder="Mínimo 8 caracteres"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <span
                      className="toggle-visibility-inside"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.07 21.07 0 0 1 5.06-6.06" /><path d="M1 1l22 22" /></svg>
                      )}
                    </span>
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Confirmar contraseña <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-input"
                    placeholder="Repite la contraseña"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between mt-4">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => window.history.back()}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary-custom"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAccountForm;