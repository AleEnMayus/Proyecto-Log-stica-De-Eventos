import React, { useState, useEffect } from "react";
import "../../CSS/components.css";
import "../../CSS/Lists.css";
import "../../CSS/Modals.css";

const EditResource = ({ resource, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    ResourceId: "",
    ResourceName: "",
    ResourceCode: "",
    Quantity: "",
    Status: "Available",
    StatusDescription: "",
    Price: "",
  });

  useEffect(() => {
    if (resource) {
      setFormData({
        ResourceId: resource.ResourceId,
        ResourceName: resource.ResourceName || "",
        ResourceCode: resource.ResourceCode || "",
        Quantity: resource.Quantity || "",
        Status: resource.Status || "Available",
        StatusDescription: resource.StatusDescription || "",
        Price: resource.Price || "",
      });
    }
  }, [resource]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:4000/api/resources/${formData.ResourceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ResourceName: formData.ResourceName,
            Quantity: formData.Quantity,
            StatusDescription: formData.StatusDescription,
            Status: formData.Status,
            Price: formData.Price,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Error al actualizar el recurso");
      }

      const data = await res.json();
      onSave(data); // notifica al padre
    } catch (err) {
      console.error("Error actualizando recurso:", err);
    }
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
                    name="ResourceName"
                    className="field-value"
                    value={formData.ResourceName}
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
                    name="Quantity"
                    className="field-value"
                    value={formData.Quantity}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="field">
                  <label className="field-label">Estado</label>
                  <select
                    name="Status"
                    className="field-value"
                    value={formData.Status}
                    onChange={handleChange}
                  >
                    <option value="Available">Disponible</option>
                    <option value="In_use">En uso</option>
                    
                  </select>
                </div>
              </div>

              <div className="field">
                <label className="field-label">Descripción</label>
                <textarea
                  name="StatusDescription"
                  className="field-value min-h-200px"
                  value={formData.StatusDescription}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label className="field-label">Precio</label>
                <input
                  type="number"
                  step="0.01"
                  name="Price"
                  className="field-value"
                  value={formData.Price}
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