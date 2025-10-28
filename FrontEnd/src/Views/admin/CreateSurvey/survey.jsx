import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeaderAdm from "../../../components/HeaderSidebar/HeaderAdm";
import "../../CSS/Lists.css"; // CSS universal

const Survey = () => {
  const [questions, setQuestions] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;

  // 🔹 Cargar preguntas desde el backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/questions");
        if (!res.ok) throw new Error("Error al obtener preguntas");
        const data = await res.json();
        setQuestions(data); // API devuelve [{ QuestionId, QuestionText }]
      } catch (err) {
        console.error("Error cargando preguntas:", err);
      }
    };
    fetchQuestions();
  }, []);

  // Filtrado
  const questionsFiltradas = questions.filter((q) =>
    q.QuestionText?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const totalPages = Math.ceil(questionsFiltradas.length / questionsPerPage);
  const indexOfLast = currentPage * questionsPerPage;
  const indexOfFirst = indexOfLast - questionsPerPage;
  const currentQuestions = questionsFiltradas.slice(indexOfFirst, indexOfLast);

  return (
    <div className="list-container">
      <HeaderAdm />

      {/* Header */}
      <div className="list-header mt-5 pt-5">
        <h2 className="list-title">Preguntas Registradas</h2>
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
        <span className="search-label">Buscar preguntas</span>
        <div className="search-input-group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="currentcolor"
          >
            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por texto de la pregunta..."
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
              <th>ID</th>
              <th>Pregunta</th>
            </tr>
          </thead>
          <tbody>
            {currentQuestions.map((q) => (
              <tr key={q.QuestionId}>
                <td>{q.QuestionId}</td>
                <td>{q.QuestionText}</td>
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
                className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
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
      {questionsFiltradas.length === 0 && (
        <div className="empty-state">
          <p>No se encontraron preguntas registradas.</p>
        </div>
      )}
    </div>
  );
};

export default Survey;
