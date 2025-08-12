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

  // Usuarios de prueba
  const testUsers = {
    'admin@happyart.com': {
      password: 'admin123',
      data: { 
        id: 1,
        name: 'Ana Administradora', 
        role: 'admin', 
        email: 'admin@happyart.com' 
      }
    },
    'user@happyart.com': {
      password: 'user123',
      data: { 
        id: 2,
        name: 'Juan Usuario', 
        role: 'user', 
        email: 'user@happyart.com' 
      }
    },
    'cliente@happyart.com': {
      password: 'cliente123',
      data: { 
        id: 3,
        name: 'María Cliente', 
        role: 'user', 
        email: 'cliente@happyart.com' 
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simular delay de API
    setTimeout(() => {
      const user = testUsers[formData.email.toLowerCase()];
      
      if (user && user.password === formData.password) {
        // Login exitoso
        localStorage.setItem('user', JSON.stringify(user.data));
        console.log('Login exitoso:', user.data);
        
        // Redirigir al home
        navigate('/');
      } else {
        // Login fallido
        setError('Email o contraseña incorrectos');
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const loginDemo = (userType) => {
    const demoCredentials = {
      admin: { email: 'admin@happyart.com', password: 'admin123' },
      user: { email: 'user@happyart.com', password: 'user123' },
      cliente: { email: 'cliente@happyart.com', password: 'cliente123' }
    };

    const creds = demoCredentials[userType];
    setFormData({
      email: creds.email,
      password: creds.password
    });
    setError('');
  };

  const handleGoBackBrowser = () => {
    window.history.back();
  };

  const handleGoogleLogin = () => {
    // Simular login con Google (usuario demo)
    const googleUser = {
      id: 4,
      name: 'Usuario Google',
      role: 'user',
      email: 'google@usuario.com'
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
                <button onClick={handleGoBackBrowser} className="back-btn me-4" title="Volver">
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

      {/* Main Content */}
      <div className="login-content mt-4">
        {/* Panel de usuarios demo - Solo para testing */}
        <div className="demo-panel mb-4">
          <div className="card">
            <div className="card-body">
              <h6 className="card-title text-muted mb-3">🧪 Panel de Testing - Usuarios Demo</h6>
              <div className="row g-2">
                <div className="col-md-4">
                  <button 
                    type="button" 
                    className="btn btn-outline-success btn-sm w-100"
                    onClick={() => loginDemo('user')}
                  >
                    👤 Usuario Normal
                  </button>
                </div>
                <div className="col-md-4">
                  <button 
                    type="button" 
                    className="btn btn-outline-warning btn-sm w-100"
                    onClick={() => loginDemo('admin')}
                  >
                    👑 Administrador
                  </button>
                </div>
                <div className="col-md-4">
                  <button 
                    type="button" 
                    className="btn btn-outline-info btn-sm w-100"
                    onClick={() => loginDemo('cliente')}
                  >
                    🎉 Cliente Premium
                  </button>
                </div>
              </div>
              <small className="text-muted mt-2 d-block">
                Haz clic en cualquier botón para rellenar las credenciales automáticamente
              </small>
            </div>
          </div>
        </div>

        {/* Login Form */}
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

          {/* Credenciales de prueba */}
          <div className="credentials-info mt-4">
            <small className="text-muted">
              <strong>Credenciales de prueba:</strong><br/>
              • Admin: admin@happyart.com / admin123<br/>
              • Usuario: user@happyart.com / user123<br/>
              • Cliente: cliente@happyart.com / cliente123
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;