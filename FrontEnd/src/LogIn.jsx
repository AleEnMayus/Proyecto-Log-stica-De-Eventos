import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LogIn.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        console.log("✅ Login exitoso:", data);
        navigate("/");
      } else {
        setError(data.message || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };


  const handleGoBackBrowser = () => {
    window.history.back();
  };

  const handleGoogleLogin = () => {
    const googleUser = {
      id: 4,
      name: 'Usuario Google',
      role: 'user',
      email: 'google@usuario.com',
      fullName: 'Usuario Google',
      birthDate: '',
      identificationType: '',
      documentNumber: '',
      profilePicture: 'https://randomuser.me/api/portraits/men/50.jpg'
    };
    
    localStorage.setItem('user', JSON.stringify(googleUser));
    console.log('Login con Google:', googleUser);
    navigate('/');
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
              <a href="/Register" className="btn-primary-custom btn">
                Registrarse
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="login-content mt-4">
        <div className="login-form-card">
          <h1 className="login-title">Iniciar Sesión</h1>
          <p className="login-subtitle">
            Accede a tu cuenta de Happy-Art Eventos
          </p>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

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
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-input"
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
            
            <div className="form-options">
              <Link to="/recover" className="forgot-password">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            
            <button
              type="submit"
              className="btn-primary-custom login-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="divider">
            <span>O continúa con</span>
          </div>

          <div className="social-buttons">
            <button 
              className="social-btn" 
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              {isLoading ? 'Conectando...' : 'Google'}
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
