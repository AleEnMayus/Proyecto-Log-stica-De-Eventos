import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderAdm from "../../../components/HeaderSidebar/HeaderAdm";
import "../../CSS/components.css";
import "../../CSS/FormsUser.css";

const PromotionsForm = () => {
  const navigate = useNavigate();
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
    alert("✅ Promoción creada con éxito");
  };

  const handleCancel = () => {
    navigate(-1); // ⬅️ vuelve al apartado anterior
  };

  return (
    <>
      <HeaderAdm />

      <div
        className="login-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div
          className="form-container-custom"
          style={{
            width: "70%", // 🔹 más angosto que antes
            maxWidth: "600px",
            marginTop: "-40px", // 🔹 sube un poco el formulario
          }}
        >
          <h1 className="form-page-title">CREAR PROMOCIÓN</h1>

          <form onSubmit={handleSubmit}>
            {/* Nombre */}
            <div className="form-row">
              <div className="form-col" style={{ flex: "1 1 100%" }}>
                <label className="form-label">Nombre Promoción</label>
                <input
                  type="text"
                  name="nombre"
                  className="form-input"
                  placeholder="Ingrese el nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Descripción */}
            <div className="form-row" style={{ marginTop: "10px" }}>
              <div className="form-col" style={{ flex: "1 1 100%" }}>
                <label className="form-label">Descripción</label>
                <textarea
                  name="descripcion"
                  className="form-input"
                  placeholder="Ingrese la descripción"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                  rows="3"
                ></textarea>
              </div>
            </div>

            {/* Estado y Precio (más cerca del anterior campo) */}
            <div
              className="form-row"
              style={{
                marginTop: "15px", // 🔹 menos espacio entre secciones
                gap: "20px",
              }}
            >
              <div className="form-col">
                <label className="form-label">Estado</label>
                <select
                  name="estado"
                  className="form-input"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="Activa">Activa</option>
                  <option value="Inactiva">Inactiva</option>
                </select>
              </div>

              <div className="form-col">
                <label className="form-label">Precio</label>
                <input
                  type="number"
                  name="precio"
                  className="form-input"
                  placeholder="Ingrese el precio"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Botones */}
            <div
              className="form-actions"
              style={{
                marginTop: "25px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary-custom">
                Crear Promoción
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PromotionsForm;
