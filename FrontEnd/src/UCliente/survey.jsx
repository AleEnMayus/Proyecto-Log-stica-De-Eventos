import React, { useState } from "react";
import './Client.css';
import HeaderCl from "../components/HeaderCl";

const Contracts = () => {
  const [experiencia, setExperiencia] = useState(0);
  const [atencion, setAtencion] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Encuesta enviada:\nExperiencia: ${experiencia} estrellas\nAtención: ${atencion} estrellas`
    );
  };

  // función para pintar estrellas
  const renderStars = (selected, setSelected) => {
    return [...Array(5)].map((_, index) => {
      const value = index + 1;
      return (
        <span
          key={value}
          onClick={() => setSelected(value)}
          style={{
            cursor: "pointer",
            fontSize: "2rem",
            marginRight: "8px",
            color: value <= selected ? "#000000" : "#ffffff",
            WebkitTextStroke: "1px #000000", // borde negro cuando está vacía
          }}
        >
          ★
        </span>
      );
    });
  };

  return (
    <div className="contratos-container">
      <HeaderCl />

      <div className="encuesta-container">
        <h2 className="encuesta-titulo">Encuesta De Satisfacción</h2>

        <form onSubmit={handleSubmit} className="encuesta-form">
          {/* Pregunta 1 */}
          <p className="encuesta-pregunta">
            Querido usuario, del 1 al 5 ¿cómo fue su experiencia en el evento?
          </p>
          <div className="estrellas">{renderStars(experiencia, setExperiencia)}</div>

          {/* Pregunta 2 */}
          <p className="encuesta-pregunta">
            ¿Cómo estuvo la atención del personal del evento?
          </p>
          <div className="estrellas">{renderStars(atencion, setAtencion)}</div>

          {/* Botón */}
          <button type="submit" className="encuesta-btn">
            Enviar Encuesta
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contracts;
