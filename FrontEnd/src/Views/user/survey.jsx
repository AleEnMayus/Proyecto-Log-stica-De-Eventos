import React, { useState } from "react";
import HeaderCl from "../../components/HeaderSidebar/HeaderCl";
import '../CSS/components.css';

const ClientSurvey = () => {
  // Estados locales para guardar las calificaciones
  // experiencia: valoración general del evento
  // atencion: valoración del personal
  const [experiencia, setExperiencia] = useState(0);
  const [atencion, setAtencion] = useState(0);

  // Función que se ejecuta al enviar el formulario
  // Actualmente muestra un alert con los valores seleccionados
  // ⚡ Aquí se recomienda llamar a una API (POST) para guardar los datos en la BD
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Encuesta enviada:\nExperiencia: ${experiencia} estrellas\nAtención: ${atencion} estrellas`
    );
  };

  // Función para renderizar estrellas clicables (rating de 1 a 5)
  // Cambia de color según si están seleccionadas o no
  // ❌ No necesita API, solo cambia estado en el frontend
  const renderStars = (selected, setSelected) => {
    return [...Array(5)].map((_, index) => {
      const value = index + 1;
      return (
        <span
          key={value}
          onClick={() => setSelected(value)} // Al hacer clic se actualiza el estado
          style={{
            cursor: "pointer",
            fontSize: "2rem",
            marginRight: "8px",
            color: value <= selected ? "#000000" : "#ffffff",
            WebkitTextStroke: "1px #000000", // Borde negro cuando la estrella está "vacía"
          }}
        >
          ★
        </span>
      );
    });
  };

  return (
    <div className="contratos-container">
      {/* Cabecera del cliente (sidebar/header) */}
      <HeaderCl />

      <div className="encuesta-container">
        <h2 className="encuesta-titulo">Encuesta De Satisfacción</h2>

        {/* Formulario principal de la encuesta */}
        <form onSubmit={handleSubmit} className="encuesta-form">

          {/* Pregunta 1: Experiencia en el evento */}
          <p className="encuesta-pregunta">
            Querido usuario, del 1 al 5 ¿cómo fue su experiencia en el evento?
          </p>
          <div className="estrellas">
            {renderStars(experiencia, setExperiencia)}
          </div>

          {/* Pregunta 2: Atención del personal */}
          <p className="encuesta-pregunta">
            ¿Cómo estuvo la atención del personal del evento?
          </p>
          <div className="estrellas">
            {renderStars(atencion, setAtencion)}
          </div>

          {/* Botón para enviar la encuesta */}
          {/* ⚡ Aquí es donde se dispara handleSubmit, que debería llamar a la API */}
          <button type="submit" className="encuesta-btn">
            Enviar Encuesta
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientSurvey;

