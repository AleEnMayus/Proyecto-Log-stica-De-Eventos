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

  // Usuarios de prueba con datos adicionales
  const testUsers = {
    'admin@happyart.com': {
      password: 'admin123',
      data: { 
        id: 1,
        fullName: 'Ana María Administradora',
        role: 'admin', 
        email: 'admin@happyart.com',
        phoneNumber: '300 1234567',
        birthDate: '1985-03-15',
        identificationType: 'cedula',
        documentNumber: '123456789',
        profilePicture: 'https://randomuser.me/api/portraits/women/45.jpg'
      }
    },
    'user@happyart.com': {
      password: 'user123',
      data: { 
        id: 2,
        fullName: 'Juan Pérez',
        role: 'user', 
        email: 'user@happyart.com',
        phoneNumber: '300 1234567',
        birthDate: '1992-07-20',
        identificationType: 'cedula',
        documentNumber: '987654321',
        profilePicture: 'https://randomuser.me/api/portraits/men/46.jpg'
      }
    }
  };

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

    setTimeout(() => {
      const user = testUsers[formData.email.toLowerCase()];
      
      if (user && user.password === formData.password) {
        localStorage.setItem('user', JSON.stringify(user.data));
        console.log('Login exitoso:', user.data);
        navigate('/');
      } else {
        setError('Email o contraseña incorrectos');
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const loginDemo = (userType) => {
    const demoCredentials = {
      admin: { email: 'admin@happyart.com', password: 'admin123' },
      user: { email: 'user@happyart.com', password: 'user123' }
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
        <div className="demo-panel mb-4">
          <div className="card">
            <div className="card-body">
              <h6 className="card-title text-muted mb-3">🧪 Panel de Testing - Usuarios Demo</h6>
              <div className="row g-2">
                <div className="col-md-6">
                  <button 
                    type="button" 
                    className="btn btn-outline-success btn-sm w-100"
                    onClick={() => loginDemo('user')}
                  >
                    👤 Usuario Normal
                  </button>
                </div>
                <div className="col-md-6">
                  <button 
                    type="button" 
                    className="btn btn-outline-warning btn-sm w-100"
                    onClick={() => loginDemo('admin')}
                  >
                    👑 Administrador
                  </button>
                </div>
              </div>
              <small className="text-muted mt-2 d-block">
                Haz clic en cualquier botón para rellenar las credenciales automáticamente
              </small>
            </div>
          </div>
        </div>

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

          <div className="credentials-info mt-4">
            <small className="text-muted">
              <strong>Credenciales de prueba:</strong><br/>
              • Admin: admin@happyart.com / admin123<br/>
              • Usuario: user@happyart.com / user123
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
