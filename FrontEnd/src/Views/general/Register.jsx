import React, { useState, useRef, useEffect, } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/FormsUser.css'; // Importar el archivo CSS

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

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const errorRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setErrorMessage('✅ Registro exitoso. Ahora puedes iniciar sesión.');
        setFormData({
          fullName: '',
          birthDate: '',
          identificationType: '',
          documentNumber: '',
          email: '',
          password: '',
          confirmPassword: ''
        });  
        setTimeout(() => {
            navigate('/login');
        }, 1500); // 1.5 segundos para que el usuario vea el mensaje
    
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Error en el registro');
      }
    } catch (error) {
      setErrorMessage('Error al conectar con el servidor');
    }
  };

  useEffect(() => {
    if (errorMessage && errorRef.current) {
      errorRef.current.focus();
    }
  }, [errorMessage]);

  const handleGoBackBrowser = () => {
    window.history.back();
  };

  return (
    <div className="login-container">
      <header className="bg-white shadow-sm sticky-top header-container">
        <div className="container">
          <div className="row align-items-center py-3">
            <div className="col-6">
              <div className="d-flex align-items-center">
                <button onClick={handleGoBackBrowser} className="back-btn me-4 mb-0" title="Volver">
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

      <div className="login-content mt-4 mt-10">
        <div className="login-form-card">
          <h1 className="login-title">Registrarse</h1>
          <p className="login-subtitle">
            Crea tu cuenta en Happy-Art Eventos
          </p>

          {errorMessage && 
          <div className="error-message" ref={errorRef}
          tabIndex="-1">{errorMessage}
          </div>}

          <form onSubmit={handleSubmit}>
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
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="PP">Permiso de permanencia</option>
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
