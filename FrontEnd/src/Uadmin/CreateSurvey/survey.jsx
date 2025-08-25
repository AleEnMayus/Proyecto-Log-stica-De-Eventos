import React, { useState } from "react";
import { Link } from "react-router-dom";  // 👈 Importa Link
import "./survey.css";
import HeaderAdm from "../../components/HeaderAdm";

const Survey = () => {
  const [encuestas] = useState([
    {
      id: 1,
      titulo: "Encuesta de satisfacción",
      descripcion: "Opinión sobre el servicio",
      fecha: "2025-08-18",
      estrellas: 5,
      usuario: "Juan Pérez",
    },
    {
      id: 2,
      titulo: "Encuesta de productos",
      descripcion: "Evaluación de calidad",
      fecha: "2025-08-17",
      estrellas: 4,
      usuario: "María López",
    },
  ]);

  // Renderizar estrellas
  const renderStars = (count) => {
    return "⭐".repeat(count) + "☆".repeat(5 - count);
  };

  return (
    <div className="survey-container">
      <HeaderAdm />

      {/* Título */}
      <h2>Encuestas</h2>

      {/* Botón Crear Encuesta */}
      <Link to="/createsurvay" className="create-btn">
        + Crear Encuesta
      </Link>

      {/* Buscador */}
      <input type="text" placeholder="Buscar..." className="search-box" />

      {/* Tabla */}
      <table className="survey-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>Calificación</th>
            <th>Usuario</th>
          </tr>
        </thead>
        <tbody>
          {encuestas.map((encuesta) => (
            <tr key={encuesta.id}>
              <td>{encuesta.titulo}</td>
              <td>{encuesta.descripcion}</td>
              <td>{encuesta.fecha}</td>
              <td>{renderStars(encuesta.estrellas)}</td>
              <td className="user-cell">
                <div className="user-avatar">{encuesta.usuario[0]}</div>
                {encuesta.usuario}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="pagination">
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>4</button>
        <button>5</button>
        <button>6</button>
        <button>7</button>
        <button>8</button>
        <button>9</button>
      </div>
    </div>
  );
};

export default Survey;
