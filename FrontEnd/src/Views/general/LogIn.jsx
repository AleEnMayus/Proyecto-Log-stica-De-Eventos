import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../CSS/FormsUser.css";
import { useToast } from '../../hooks/useToast'; // Asegúrate que esta ruta esté bien
import ToastContainer from '../../components/ToastContainer'; // Contenedor visual de los toasts

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { toasts, addToast, removeToast } = useToast();

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Enviar datos de login al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("Login exitoso:", data.user);

        addToast("Inicio de sesión exitoso", "success");

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        addToast(data.message || "Error al iniciar sesión", "danger");
      }
    } catch (err) {
      addToast("Error de conexión con el servidor", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  // Volver atrás con el navegador
  const handleGoBackBrowser = () => {
    navigate(`/`);
  };

  return (
    <div className="login-container">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <header className="bg-white shadow-sm sticky-top header-container">
        <div className="container">
          <div className="row align-items-center py-3 justify-content-between">
            <div className="col-6">
              <div className="d-flex align-items-center">
                <button onClick={handleGoBackBrowser} className="back-btn me-4 mb-0" title="Volver">
                  ←
                </button>
                <div className="logo-text">
                  Happy-Art-Events
                </div>
              </div>
            </div>
            <div className="col-6 text-end w-auto">
              <a href="/Register" className="btn-primary-custom btn">
                Registrarse
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="login-content mt-4 mt-10">
        <div className="login-form-card">
          <h1 className="login-title">Iniciar Sesión</h1>
          <p className="login-subtitle">
            Accede a tu cuenta de Happy-Art-Events
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
              disabled={isLoading}
            />

            <label className="form-label">Contraseña</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.07 21.07 0 0 1 5.06-6.06" />
                    <path d="M1 1l22 22" />
                  </svg>
                )}
              </button>
            </div>

            <div
              className="form-options"
              style={{ width: "100%", marginBottom: "15px", display: "flex", justifyContent: "center" }}
            >
              <Link
                to="/recover"
                className="forgot-password"
                style={{ display: "block", textAlign: "center" }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>


            <button
              type="submit"
              className="btn-primary-custom"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "14px 0",
                fontSize: "16px"
              }}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
          <div className="divider">O</div>

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
