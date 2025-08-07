import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './LogIn.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    console.log('Login attempt:', formData);
    // Aquí iría la lógica de autenticación
  };

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
                        <button onClick={handleGoBackBrowser} className="back-btn me-4" title="Volver">
                            ←
                        </button>
                        <div className="logo-text ">
                            Happy-Art Eventos
                        </div>
                    </div>
                </div>
                    <div className="col-6 text-end">
                        <a href="/Register" className="btn-primary-custom btn">
                        Registrarse
                        </a>
                    </div>
                </div>
            </div>
        </header>
      {/* Main Content */}
        <div className="login-content mt-4">
          
          {/* Login Form */}
          <div className="login-form-card">
            <h1 className="login-title">Iniciar Sesión</h1>
            <p className="login-subtitle">
              Accede a tu cuenta de Happy-Art Eventos
            </p>

            <form onSubmit={handleSubmit}>
              <label className="form-label">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="tu@ejemplo.com"
                required
              />

              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder="••••••••"
                required
              />

              <div className="form-options">
                <Link to="/recover" className="forgot-password">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <button
                type="submit"
                className="btn-primary-custom login-btn"
              >
                Iniciar Sesión
              </button>
            </form>

            <div className="divider">
                <span>O continúa con</span>
            </div>

            <div className="social-buttons">
              <button className="social-btn" type="button">
                Google
              </button>
            </div>

            <p className="register-link">
              ¿No tienes una cuenta?{' '}
              <a href='/Register'>
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </div>
  );
};

export default LoginPage;