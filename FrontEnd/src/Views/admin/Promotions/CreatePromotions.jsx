import React, { useState } from "react";
import HeaderAdm from "../../../components/HeaderSidebar/HeaderAdm";
import "../../CSS/components.css";
import "../../CSS/Promotions.css";

export default function PromotionsForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    estado: "",
    precio: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Promoción creada:", formData);
    alert("Promoción creada con éxito");
  };

  const handleCancel = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      estado: "",
      precio: "",
    });
  };

  return (
    <>
      <HeaderAdm /> {/* Header visible en la parte superior */}
      <br /><br /><br />

      <div className="form-page">
        <div className="form-container">
          <h2>CREAR PROMOCIONES</h2>

          <form onSubmit={handleSubmit} className="promo-form">
            <label>Nombre Promoción</label>
            <input
              type="text"
              name="nombre"
              placeholder="Ingrese el nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />

            <label>Descripción</label>
            <textarea
              name="descripcion"
              placeholder="Ingrese la descripción"
              value={formData.descripcion}
              onChange={handleChange}
              required
            ></textarea>

            <div className="row">
              <div>
                <label>Estado</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="Activa">Activa</option>
                  <option value="Inactiva">Inactiva</option>
                </select>
              </div>

              <div>
                <label>Precio</label>
                <input
                  type="number"
                  name="precio"
                  placeholder="Ingrese el precio"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Botones alineados */}
            <div className="button-group">
              <button type="submit" className="btn-crear">
                Crear Promoción
              </button>
              <button
                type="button"
                className="btn-cancelar"
                onClick={handleCancel}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
