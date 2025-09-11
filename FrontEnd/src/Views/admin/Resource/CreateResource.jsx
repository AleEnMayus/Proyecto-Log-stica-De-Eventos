import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAdm from "../../../components/HeaderSidebar/HeaderAdm";
import '../../CSS/components.css';
import '../../CSS/FormsUser.css';

const CreateResource = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    resourceName: '',
    resourceCode: '',
    quantity: '',
    status: 'Disponible', // Estado por defecto
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Form data:', formData);
    alert('Recurso creado exitosamente');
  };

  const handleCancel = () => {
    navigate(-1); // Más limpio que window.history.back()
  };

  return (
    <>
      <HeaderAdm />
      <div className="login-container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>

        <div className="login-form-card w-100">
          <h1 className="login-title">CREAR RECURSO</h1>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="form-row">
              <div className="form-col">
                <label className="form-label">
                  Nombre del recurso <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="resourceName"
                  className="form-input"
                  placeholder="Ej: Proyector, Micrófono, Silla..."
                  value={formData.resourceName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-col">
                <label className="form-label">
                  Código del recurso <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="resourceCode"
                  className="form-input"
                  placeholder="Ej: PRJ-01, MIC-01, SLL-01..."
                  value={formData.resourceCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <label className="form-label">
                  Cantidad <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  className="form-input"
                  placeholder="Ej: 10"
                  min="1"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-col">
                <label className="form-label">
                  Estado <span className="text-danger">*</span>
                </label>
                <select
                  name="status"
                  className="form-input"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Disponible">Disponible</option>
                  <option value="En uso">En uso</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Fuera de servicio">Fuera de servicio</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Descripción del recurso <span className="text-danger">*</span>
              </label>
              <textarea
                name="description"
                className="form-input"
                placeholder="Describe las características, especificaciones técnicas o detalles importantes del recurso..."
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                style={{ resize: 'vertical' }}
                required
              />
            </div>

            <div className="form-actions">
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
                Crear Recurso
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateResource;
