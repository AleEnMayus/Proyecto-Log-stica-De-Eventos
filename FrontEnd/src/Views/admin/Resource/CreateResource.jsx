// Importaciones de React y hooks
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Importación de componentes y estilos
import HeaderAdm from "../../../components/HeaderSidebar/HeaderAdm";
import '../../CSS/components.css';
import '../../CSS/FormsUser.css';

/**
 * Componente: CreateResource
 * Permite crear un nuevo recurso mediante un formulario.
 */
const CreateResource = () => {
  const navigate = useNavigate();

  // Estado local del formulario
  const [formData, setFormData] = useState({
    resourceName: '',     // Nombre del recurso
    quantity: '',         // Cantidad disponible
    status: 'Available', // Estado por defecto
    description: '',      // Descripción del recurso
    price: ''             // Precio (opcional)
  });

  // Maneja cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Enviar datos a la API
  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ResourceName: formData.resourceName,
          Quantity: formData.quantity,
          StatusDescription: formData.description,
          Status: formData.status,
          Price: formData.price || 0
        })
      });

      if (!response.ok) throw new Error("Error al crear recurso");

      const newResource = await response.json();
      console.log("Recurso creado:", newResource);

      alert(" Recurso creado exitosamente");
      navigate("/HomeResources");
    } catch (error) {
      console.error("Error creando recurso:", error);
      alert(" Ocurrió un error al crear el recurso");
    }
  };

  // Cancelar y volver atrás
  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <>
      <HeaderAdm />

      <div className="login-container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="login-form-card w-100">
          <h1 className="login-title">CREAR RECURSO</h1>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            
            {/* Nombre y Cantidad */}
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
                  Cantidad <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="quantity"
                  className="form-input"
                  placeholder="Ej: 10"
                  min="1"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Estado y Precio */}
            <div className="form-row">
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
                  <option value="Available">Disponible</option>
                  <option value="In_use">En uso</option>
                </select>
              </div>
              <div className="form-col">
                <label className="form-label">
                  Precio (opcional)
                </label>
                <input
                  type="number"
                  name="price"
                  className="form-input"
                  placeholder="Ej: 50000"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Descripción */}
            <div className="mb-3">
              <label className="form-label">
                Descripción del recurso <span className="text-danger">*</span>
              </label>
              <textarea
                name="description"
                className="form-input"
                placeholder="Describe características o detalles importantes del recurso..."
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                style={{ resize: 'vertical' }}
                required
              />
            </div>

            {/* Botones */}
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
