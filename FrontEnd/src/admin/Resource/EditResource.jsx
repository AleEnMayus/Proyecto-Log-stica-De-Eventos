import React, { useState, useEffect } from "react";
import "../../components/components.css";
import "../../components/CSS/Lists.css";
import "../../components/CSS/modals.css";

const EditResource = ({ resource, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    code: "",
    quantity: "",
    status: "Disponible",
    description: "",
  });

  useEffect(() => {
    if (resource) {
      setFormData(resource);
    }
  }, [resource]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="profile-modal">
        <button className="close-btn" onClick={onCancel}>×</button>
        <div className="pm-body">
          <div className="pm-fields w-100">
            <h3 className="text-center mb-3">Editar Recurso</h3>

            <form onSubmit={handleSubmit}>
              <div className="field-row two-cols">
                <div className="field">
                  <label className="field-label">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    className="field-value"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="field">
                  <label className="field-label">Código</label>
                  <input
                    type="text"
                    name="code"
                    className="field-value"
                    value={formData.code}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="field-row two-cols">
                <div className="field">
                  <label className="field-label">Cantidad</label>
                  <input
                    type="number"
                    name="quantity"
                    className="field-value"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="field">
                  <label className="field-label">Estado</label>
                  <select
                    name="status"
                    className="field-value"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="En uso">En uso</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label className="field-label">Descripción</label>
                <textarea
                  name="description"
                  className="field-value min-h-200px"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="pm-footer">
                <button type="button" className="btn-secondary-custom" onClick={onCancel}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary-custom">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditResource;
