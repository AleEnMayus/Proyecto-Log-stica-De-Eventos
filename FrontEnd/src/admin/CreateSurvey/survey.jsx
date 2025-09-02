import React, { useState } from "react";
import { Link } from "react-router-dom";
import HeaderAdm from "../../components/HeaderAdm";
import "../../components/CSS/Lists.css"; // CSS universal

const Survey = () => {
  // Simulación de tabla "Answers" con relación a Questions, User y Events
  const [answers] = useState([
    {
      AnswerId: 1,
      NumericValue: 5,
      EventId: 101,
      UserId: 201,
      QuestionText: "¿Qué tan satisfecho estás con el servicio?",
      UserName: "Juan Pérez",
      Fecha: "2025-08-18",
    },
    {
      AnswerId: 2,
      NumericValue: 4,
      EventId: 102,
      UserId: 202,
      QuestionText: "¿Qué opinas de la calidad del producto?",
      UserName: "María López",
      Fecha: "2025-08-17",
    },
    {
      AnswerId: 3,
      NumericValue: 3,
      EventId: 103,
      UserId: 203,
      QuestionText: "¿Cómo calificas la usabilidad de la plataforma?",
      UserName: "Carlos Ruiz",
      Fecha: "2025-08-16",
    },
    {
      AnswerId: 4,
      NumericValue: 5,
      EventId: 104,
      UserId: 204,
      QuestionText: "¿Qué funcionalidades valoras más?",
      UserName: "Ana Martínez",
      Fecha: "2025-08-15",
    },
    {
      AnswerId: 5,
      NumericValue: 4,
      EventId: 105,
      UserId: 205,
      QuestionText: "¿Cómo calificas el soporte técnico?",
      UserName: "Pedro González",
      Fecha: "2025-08-14",
    },
    {
      AnswerId: 6,
      NumericValue: 5,
      EventId: 106,
      UserId: 206,
      QuestionText: "¿Qué opinas del diseño visual?",
      UserName: "Laura Silva",
      Fecha: "2025-08-13",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const answersPerPage = 3;

  // Filtrado
  const answersFiltrados = answers.filter(
    (a) =>
      a.QuestionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.UserName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const totalPages = Math.ceil(answersFiltrados.length / answersPerPage);
  const indexOfLast = currentPage * answersPerPage;
  const indexOfFirst = indexOfLast - answersPerPage;
  const currentAnswers = answersFiltrados.slice(indexOfFirst, indexOfLast);

  // Renderizar estrellas
  const renderStars = (count) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        style={{
          color: i < count ? "#ffc107" : "#e0e0e0",
          fontSize: "18px",
        }}
      >
        ★
      </span>
    ));
  };

  // Iniciales de usuario
  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div className="list-container">
      <HeaderAdm />

      {/* Header */}
      <div className="list-header mt-5 pt-5">
        <h2 className="list-title">Encuestas</h2>
        <Link to="/SurvayHome/create" className="btn-create">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#ffffffff"
          >
            <path d="M417-417H166v-126h251v-251h126v251h251v126H543v251H417v-251Z" />
          </svg>
          Crear Encuesta
        </Link>
      </div>

      {/* Search Bar */}
      <div className="search-container mb-4 w-50-lg">
        <span className="search-label">Buscar respuestas</span>
        <div className="search-input-group">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor">
            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por pregunta o usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="table-container">
        <table className="list-table">
          <thead>
            <tr>
              <th>Pregunta</th>
              <th>Calificación</th>
              <th>Evento</th>
              <th>Usuario</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {currentAnswers.map((a) => (
              <tr key={a.AnswerId}>
                <td>{a.QuestionText}</td>
                <td>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    {renderStars(a.NumericValue)}
                  </div>
                </td>
                <td>{a.EventId}</td>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      <span>{getInitials(a.UserName)}</span>
                    </div>
                    <span className="user-name">{a.UserName}</span>
                  </div>
                </td>
                <td>{a.Fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <nav className="pagination">
          <button
            className="pagination-arrow"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            &laquo;
          </button>

          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`pagination-btn ${
                  currentPage === i + 1 ? "active" : ""
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            className="pagination-arrow"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            &raquo;
          </button>
        </nav>
      )}

      {/* Estado vacío */}
      {answersFiltrados.length === 0 && (
        <div className="empty-state">
          <p>No se encontraron respuestas.</p>
        </div>
      )}
    </div>
  );
};

export default Survey