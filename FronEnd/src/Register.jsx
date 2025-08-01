import React, { useState } from 'react';
import './LogIn.css'; // Importar el archivo CSS

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    identificationType: '',
    documentNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    console.log('Register attempt:', formData);
    // Aquí iría la lógica de registro
  };

  const handleGoBackBrowser = () => {
    window.history.back();
  };

  return (
    <div className="login-container ">
      <header className="bg-white shadow-sm sticky-top header-container">
        <div className="container">
          <div className="row align-items-center py-3">
            <div className="col-6">
              <div className="d-flex align-items-center">
                <button onClick={handleGoBackBrowser} className="back-btn me-4" title="Volver">
                  ←
                </button>
                <div className="logo-text">
                  Happy-Art Eventos
                </div>
              </div>
            </div>
            <div className="col-6 text-end">
              <a href="/login" className="btn-primary-custom btn">
                Iniciar Sesión
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="login-content mt-4 ">
        
        {/* Register Form */}
        <div className="login-form-card">
          <h1 className="login-title">Registrarse</h1>
          <p className="login-subtitle">
            Crea tu cuenta en Happy-Art Eventos
          </p>

          <form onSubmit={handleSubmit}>
            {/* Primera fila: Nombre y Fecha */}
            <div className="row">
              <div className="col-md-6">
                <label className="form-label">Nombre Completo</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Juan Pérez"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Fecha de Nacimiento</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Segunda fila: Tipo y Número de Documento */}
            <div className="row">
              <div className="col-md-6">
                <label className="form-label">Tipo de Identificación</label>
                <select
                  name="identificationType"
                  value={formData.identificationType}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="cedula">Cédula de Ciudadanía</option>
                  <option value="cedula_extranjeria">Cédula de Extranjería</option>
                  <option value="pasaporte">Pasaporte</option>
                  <option value="tarjeta_identidad">Tarjeta de Identidad</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Número de Documento</label>
                <input
                  type="text"
                  name="documentNumber"
                  value={formData.documentNumber}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="1234567890"
                  required
                />
              </div>
            </div>

            {/* Tercera fila: Correo (ancho completo) */}
            <div className="row">
              <div className="col-12">
                <label className="form-label">Correo</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="usuario@ejemplo.com"
                  required
                />
              </div>
            </div>

            {/* Cuarta fila: Contraseñas */}
            <div className="row">
              <div className="col-md-6">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Crear una contraseña"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Confirmar Contraseña</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Repetir la contraseña"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary-custom login-btn"
            >
              Registrarse
            </button>
          </form>

          <div className="divider">
            <span>O regístrate con</span>
          </div>

          <div className="social-buttons">
            <button className="social-btn" type="button">
              Google
            </button>
          </div>

          <p className="register-link">
            ¿Ya tienes una cuenta?{' '}
            <a href="/login">
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;