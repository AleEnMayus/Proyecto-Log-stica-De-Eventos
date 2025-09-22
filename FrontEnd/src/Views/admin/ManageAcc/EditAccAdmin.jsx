import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../CSS/FormsUser.css';

const EditAccountPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    birthDate: '',
    documentType: '',
    documentNumber: '',
    rol: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // Cargar datos del usuario
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/accounts/${userId}`);
        if (!response.ok) throw new Error("Error al cargar datos");
        const userData = await response.json();

        setFormData({
          firstName: userData.Names || "",
          email: userData.Email || "",
          birthDate: userData.BirthDate ? userData.BirthDate.split("T")[0] : "",
          documentType: userData.DocumentType || "",
          documentNumber: userData.DocumentNumber || "",
          rol: userData.Role || "",
          password: "",
          confirmPassword: ""
        });
        setLoading(false);
      } catch (error) {
        console.error('Error cargando datos del usuario:', error);
        setLoading(false);
      }
    };

    if (userId) loadUserData();
  }, [userId]);

  const validateForm = () => {
    const newErrors = {};

    // Campos obligatorios
    const requiredFields = ['firstName', 'email', 'birthDate', 'documentType', 'documentNumber', 'rol'];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'Este campo es obligatorio';
      }
    });

    // Validar mayoría de edad
    const birthDate = new Date(formData.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const isUnder18 = age < 18 || (age === 18 && today < new Date(birthDate.setFullYear(birthDate.getFullYear() + 18)));
    if (isUnder18) {
      newErrors.birthDate = 'Debes ser mayor de edad';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Correo no válido';
    }

    // Validar contraseña si la cambia
    if (formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = 'Mínimo 8 caracteres';
      }
      if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = 'Debe incluir al menos una mayúscula';
      }
      if (!/[a-z]/.test(formData.password)) {
        newErrors.password = 'Debe incluir al menos una minúscula';
      }
      if (!/[0-9]/.test(formData.password)) {
        newErrors.password = 'Debe incluir al menos un número';
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
        newErrors.password = 'Debe incluir un caracter especial';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch(`http://localhost:4000/api/accounts/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Names: formData.firstName,
          DocumentType: formData.documentType,
          DocumentNumber: formData.documentNumber,
          BirthDate: formData.birthDate,
          Email: formData.email,
          Password: formData.password || undefined,
          Status: "active",
          Role: formData.rol
        })
      });

      if (!response.ok) throw new Error('Error al actualizar');

      const data = await response.json();
      alert('Usuario actualizado exitosamente!');
      console.log("Respuesta del servidor:", data);

      navigate('/ManageAccounts');
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      alert('Error al actualizar el usuario. Intenta de nuevo.');
    }
  };

  const handleCancel = () => {
    navigate('/ManageAccounts');
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

        <div className="login-form-card" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 className="login-title">EDITAR CUENTA</h1>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="mb-3">
              <label className="form-label">Nombre completo <span className="text-danger">*</span></label>
              <input
                type="text"
                name="firstName"
                className="form-input"
                placeholder="Ingresa tu nombre"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              {errors.firstName && <p className="error-text">{errors.firstName}</p>}
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Correo electrónico <span className="text-danger">*</span></label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="ejemplo@correo.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Fecha de nacimiento <span className="text-danger">*</span></label>
                <input
                  type="date"
                  name="birthDate"
                  className="form-input"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                />
                {errors.birthDate && <p className="error-text">{errors.birthDate}</p>}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Tipo de documento <span className="text-danger">*</span></label>
                <select
                  name="documentType"
                  className="form-input"
                  value={formData.documentType}
                  onChange={handleInputChange}
                >
                  <option value="">Elige tipo</option>
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="PP">Pasaporte</option>
                </select>
                {errors.documentType && <p className="error-text">{errors.documentType}</p>}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Número de documento <span className="text-danger">*</span></label>
                <input
                  type="text"
                  name="documentNumber"
                  className="form-input"
                  placeholder="Ej: 1234567890"
                  value={formData.documentNumber}
                  onChange={handleInputChange}
                />
                {errors.documentNumber && <p className="error-text">{errors.documentNumber}</p>}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Rol <span className="text-danger">*</span></label>
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
              {errors.rol && <p className="error-text">{errors.rol}</p>}
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Contraseña</label>
                <div className="input-with-icon">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-input d-flex align-items-center"
                    placeholder="Mínimo 8 caracteres"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <span
                    className="toggle-visibility-inside"
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
                        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8
                     a21.07 21.07 0 0 1 5.06-6.06" />
                        <path d="M1 1l22 22" />
                      </svg>
                    )}
                  </span>
                </div>
                {errors.password && <p className="error-text">{errors.password}</p>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Confirmar Contraseña</label>
                <div className="input-with-icon">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="form-input d-flex align-items-center"
                    placeholder="Repite la contraseña"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  <span
                    className="toggle-visibility-inside"
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
                        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8
                     a21.07 21.07 0 0 1 5.06-6.06" />
                        <path d="M1 1l22 22" />
                      </svg>
                    )}
                  </span>
                </div>
                {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="d-flex justify-content-between mt-4">
              <button type="button" className="btn-cancel" onClick={handleCancel}>Cancelar</button>
              <button type="submit" className="btn-primary-custom">Actualizar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAccountPage;