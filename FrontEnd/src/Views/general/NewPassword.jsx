import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../CSS/FormsUser.css";

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (formData.newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return false;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    
    if (formData.currentPassword === formData.newPassword) {
      setError('La nueva contraseña debe ser diferente a la actual');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    // Simulamos la actualización de contraseña
    setTimeout(() => {
      // Aquí iría la lógica real para actualizar la contraseña
      const currentUser = JSON.parse(localStorage.getItem('user'));
      
      if (currentUser) {
        // Simulamos validación de contraseña actual
        const isCurrentPasswordValid = formData.currentPassword === 'admin123' || formData.currentPassword === 'user123';
        
        if (isCurrentPasswordValid) {
          setSuccess('¡Contraseña actualizada exitosamente!');
          setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
          
          // Redirigir después de 2 segundos
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          setError('La contraseña actual no es correcta');
        }
      } else {
        setError('Usuario no encontrado. Por favor, inicia sesión nuevamente.');
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const handleGoBackBrowser = () => {
    window.history.back();
  };

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
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
          </div>
        </div>
      </header>

      <div className="login-content mt-4">
        <div className="login-form-card">
          <h1 className="login-title">Actualizar Contraseña</h1>
          <p className="login-subtitle">
            Cambia tu contraseña por una más segura
          </p>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success" role="alert">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3 position-relative input-with-icon">
              <label className="form-label">Contraseña actual</label>
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Escribe tu contraseña actual"
                required
                disabled={isLoading}
              />
              <span
                className="toggle-visibility-inside"
                onClick={() => togglePasswordVisibility('current')}
                style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
              >
                {showCurrentPassword ? (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.07 21.07 0 0 1 5.06-6.06" /><path d="M1 1l22 22" /></svg>
                )}
              </span>
            </div>
            
            <div className="mb-3 position-relative input-with-icon">
              <label className="form-label">Nueva Contraseña</label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Escribe tu nueva contraseña (mín. 6 caracteres)"
                required
                disabled={isLoading}
                minLength="6"
              />
              <span
                className="toggle-visibility-inside"
                onClick={() => togglePasswordVisibility('new')}
                style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
              >
                {showNewPassword ? (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.07 21.07 0 0 1 5.06-6.06" /><path d="M1 1l22 22" /></svg>
                )}
              </span>
            </div>

            <div className="mb-3 position-relative input-with-icon">
              <label className="form-label">Confirmar Contraseña</label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Confirma tu nueva contraseña"
                required
                disabled={isLoading}
              />
              <span
                className="toggle-visibility-inside"
                onClick={() => togglePasswordVisibility('confirm')}
                style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
              >
                {showConfirmPassword ? (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.07 21.07 0 0 1 5.06-6.06" /><path d="M1 1l22 22" /></svg>
                )}
              </span>
            </div>
            
            <button
              type="submit"
              className="btn-primary-custom login-btn"
              disabled={isLoading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
            >
              {isLoading ? 'Actualizando...' : 'Confirmar nueva contraseña'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;