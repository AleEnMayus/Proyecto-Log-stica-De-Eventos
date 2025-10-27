import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderAdm from "../../../components/HeaderSidebar/HeaderAdm";
import "../../CSS/components.css";
import "../../CSS/Promotions.css"; // 

const PromotionsAdmin = () => {
  const promociones = [
    {
      id: 1,
      titulo: "Sencillo",
      descripcion:
        '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex."',
    },
    {
      id: 2,
      titulo: "Regular",
      descripcion:
        '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex."',
    },
    {
      id: 3,
      titulo: "Lujoso",
      descripcion:
        '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex."',
    },
  ];

  return (
    <>
      <HeaderAdm />

      {/* Contenedor principal centrado y con margen bajo el header */}
      <div className="promotions-wrapper container">
        {/* Título y botón crear */}
        <div className="d-flex justify-content-between align-items-center mb-4 w-100">
          <h2 className="fw-bold">PROMOCIONES</h2>
          <button className="btn btn-primary-custom d-flex align-items-center">
            <span className="material-symbols-outlined me-2">add</span>
            Crear Promoción
          </button>
        </div>

        {/* Descripción general */}
        <p className="text-secondary description-text">
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex."
        </p>

        {/* Tarjetas de promociones */}
        <div className="row mt-4 justify-content-center w-100">
          {promociones.map((promo) => (
            <div key={promo.id} className="col-md-3 col-sm-6 mb-4">
              <div
                className="p-3 border rounded-3 bg-light text-center"
                style={{ minHeight: "280px" }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="fw-bold mb-0">{promo.titulo}</h5>
                  <div>
                    <span
                      className="material-symbols-outlined text-danger me-2"
                      style={{ cursor: "pointer" }}
                      title="Eliminar"
                    >
                      delete
                    </span>
                    <span
                      className="material-symbols-outlined text-primary"
                      style={{ cursor: "pointer" }}
                      title="Editar"
                    >
                      edit
                    </span>
                  </div>
                </div>
                <p className="text-secondary" style={{ fontSize: "0.9rem" }}>
                  {promo.descripcion}
                </p>
                <div className="d-flex justify-content-center gap-3 mt-auto">
                  <button className="btn btn-primary-custom px-4">
                    Activar
                  </button>
                  <button className="btn btn-secondary-custom px-4">
                    Desactivar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PromotionsAdmin;
