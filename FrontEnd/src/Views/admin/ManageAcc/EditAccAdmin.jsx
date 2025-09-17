import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../CSS/FormsUser.css'

// Componente del formulario de edición como página independiente
const EditAccountPage = () => {
  const { userId } = useParams(); // Obtiene el ID del usuario desde la URL
  const navigate = useNavigate();
  
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
  const [loading, setLoading] = useState(true);

  // Simular carga de datos del usuario (aquí harías tu llamada a la API)
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Simular datos de ejemplo - reemplaza con tu llamada real a la API
        const mockUsers = {
          '1': {
            firstName: 'Juan',
            lastName: 'Pérez García',
            email: 'juan.perez@email.com',
            birthDate: '1990-05-15',
            documentType: 'cedula',
            documentNumber: '1234567890',
            rol: 'estudiante'
          },
          '2': {
            firstName: 'María',
            lastName: 'González López',
            email: 'maria.gonzalez@email.com',
            birthDate: '1985-08-20',
            documentType: 'cedula',
            documentNumber: '0987654321',
            rol: 'profesor'
          }
        };

        const userData = mockUsers[userId];
        if (userData) {
          setFormData({
            ...userData,
            password: '' // No prellenar contraseña por seguridad
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error cargando datos del usuario:', error);
        setLoading(false);
      }
    };

    if (userId) {
      loadUserData();
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    // Validación básica (sin contraseña obligatoria para edición)
    const requiredFields = ['firstName', 'lastName', 'email', 'birthDate', 'documentType', 'documentNumber', 'rol'];
    const emptyFields = requiredFields.filter(field => !formData[field]);
    
    if (emptyFields.length > 0) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }
    
    try {
      // Aquí harías tu llamada a la API para actualizar el usuario
      console.log('Actualizando usuario:', { ...formData, id: userId });
      
      // Simular llamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Usuario actualizado exitosamente!');
      navigate('/ManageAccounts'); // Redirigir de vuelta a la lista de usuarios
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      alert('Error al actualizar el usuario. Intenta de nuevo.');
    }
  };

  const handleCancel = () => {
    navigate('/ManageAccounts'); // Redirigir de vuelta a la lista de usuarios
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Cargando datos del usuario...</div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-content">
        <button className="back-btn" onClick={() => window.history.back()}>
          ←
        </button>

        <div className="login-form-card">
          <h1 className="login-title">EDITAR CUENTA</h1>

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
export default EditAccountPage;