import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../../hooks/useToast'; // Importar toast
import ToastContainer from '../../../components/ToastContainer'; // Importar contenedor
import '../../CSS/FormsUser.css';

const EditAccountPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast(); // Hook de toasts

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
        addToast("Error al cargar datos del usuario", "danger");
        setLoading(false);
      }
    };

    if (userId) loadUserData();
  }, [userId, addToast]);

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['firstName', 'email', 'birthDate', 'documentType', 'documentNumber', 'rol'];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'Este campo es obligatorio';
      }
    });

    const birthDate = new Date(formData.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const isUnder18 = age < 18 || (age === 18 && today < new Date(birthDate.setFullYear(birthDate.getFullYear() + 18)));
    if (isUnder18) newErrors.birthDate = 'Debes ser mayor de edad';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email))
      newErrors.email = 'Correo no válido';

    if (formData.password) {
      if (formData.password.length < 8) newErrors.password = 'Mínimo 8 caracteres';
      if (!/[A-Z]/.test(formData.password)) newErrors.password = 'Debe incluir al menos una mayúscula';
      if (!/[a-z]/.test(formData.password)) newErrors.password = 'Debe incluir al menos una minúscula';
      if (!/[0-9]/.test(formData.password)) newErrors.password = 'Debe incluir al menos un número';
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) newErrors.password = 'Debe incluir un caracter especial';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

      addToast('Usuario actualizado exitosamente!', 'success');

      setTimeout(() => {
        navigate('/ManageAccounts');
      }, 2000);

    } catch (error) {
      console.error('Error actualizando usuario:', error);
      addToast('Error al actualizar el usuario. Intenta de nuevo.', 'danger');
    }
  };

  const handleCancel = () => {
    addToast('Edición cancelada. No se guardaron los cambios.', 'danger'); // Mostrar alerta
    setTimeout(() => {
      navigate('/ManageAccounts');
    }, 2000);
  };

  if (loading) {
    return <div className="loading-message">Cargando datos del usuario...</div>;
  }

  return (
    <div className="login-container">
      <div className="login-content">
        {/* ✅ Aquí seguiría todo tu formulario sin cambios */}

        <div className="d-flex justify-content-between mt-4">
          <button type="button" className="btn-cancel" onClick={handleCancel}>Cancelar</button>
          <button type="submit" className="btn-primary-custom" onClick={handleSubmit}>Actualizar</button>
        </div>
      </div>

      {/* Contenedor Toast */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default EditAccountPage;
