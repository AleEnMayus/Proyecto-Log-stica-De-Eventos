import React, { useState } from 'react';
import '../../components/CSS/FormsUser.css'

const CreateAccountForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    documentType: '',
    documentNumber: '',
    rol: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Validación básica
    const requiredFields = ['firstName', 'lastName', 'email', 'birthDate', 'documentType', 'documentNumber', 'rol', 'password'];
    const emptyFields = requiredFields.filter(field => !formData[field]);

    if (emptyFields.length > 0) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    console.log('Datos del formulario:', formData);
    alert('Cuenta creada exitosamente!');
    // Aquí iría la lógica para enviar los datos al servidor
  };

  const handleCancel = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      birthDate: '',
      documentType: '',
      documentNumber: '',
      rol: '',
      password: ''
    });
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <button className="back-btn" onClick={() => window.history.back()}>
          ←
        </button>

        <div className="login-form-card">
          <h1 className="login-title">CREAR CUENTA</h1>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Nombre completo <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  className="form-input"
                  placeholder="Ingresa tu nombre"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Apellidos <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  className="form-input"
                  placeholder="Ingresa tus apellidos"
                  value={formData.lastName}
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
                  <option value="cedula">Cédula de Ciudadanía</option>
                  <option value="cedula_extranjeria">Cédula de Extranjería</option>
                  <option value="pasaporte">Pasaporte</option>
                  <option value="tarjeta_identidad">Tarjeta de Identidad</option>
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
                  Rol <span className="text-danger">*</span>
                </label>
                <select
                  name="rol"
                  className="form-input"
                  value={formData.rol}
                  onChange={handleInputChange}
                >
                  <option value="">Elige tipo</option>
                  <option value="user">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Contraseña <span className="text-danger">*</span>
                </label>
                <div className="input-with-icon">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-input d-flex align-items-center"
                    placeholder="Mínimo 8 caracteres, 1 mayúscula, 1 número"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <span
                    className="toggle-visibility-inside"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.07 21.07 0 0 1 5.06-6.06" /><path d="M1 1l22 22" /></svg>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between mt-4">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
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
  );
};

export default CreateAccountForm;