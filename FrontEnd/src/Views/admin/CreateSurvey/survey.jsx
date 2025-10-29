import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeaderAdm from "../../../components/HeaderSidebar/HeaderAdm";
import "../../CSS/Lists.css";

const Survey = () => {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const questionsPerPage = 5;

  // Cargar preguntas
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/questions");
        if (!res.ok) throw new Error("Error al obtener preguntas");
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.error("Error cargando preguntas:", err);
      }
    };
    fetchQuestions();
  }, []);

  // Filtrar
  const questionsFiltradas = questions.filter((q) =>
    q.QuestionText?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const totalPages = Math.ceil(questionsFiltradas.length / questionsPerPage);
  const indexOfLast = currentPage * questionsPerPage;
  const indexOfFirst = indexOfLast - questionsPerPage;
  const currentQuestions = questionsFiltradas.slice(indexOfFirst, indexOfLast);

  // Abrir modal editar
  const handleEditClick = (question) => {
    setSelectedQuestion(question);
    setShowEditModal(true);
  };

  // Cerrar modal editar
  const handleCancel = () => {
    setShowEditModal(false);
    setSelectedQuestion(null);
  };

  // Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:4000/api/questions/${selectedQuestion.QuestionId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ QuestionText: selectedQuestion.QuestionText }),
        }
      );
      if (!res.ok) throw new Error("Error al actualizar la pregunta");

      // Actualizar localmente
      setQuestions((prev) =>
        prev.map((q) =>
          q.QuestionId === selectedQuestion.QuestionId ? selectedQuestion : q
        )
      );

      setShowEditModal(false);
      setSelectedQuestion(null);
    } catch (err) {
      console.error("Error al guardar cambios:", err);
    }
  };

  // Abrir modal eliminar
  const confirmDelete = (question) => {
    setQuestionToDelete(question);
    setShowDeleteModal(true);
  };

  // Eliminar pregunta
  const handleDelete = async () => {
    if (!questionToDelete) return;
    try {
      const res = await fetch(
        `http://localhost:4000/api/questions/${questionToDelete.QuestionId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Error al eliminar la pregunta");
      setQuestions((prev) =>
        prev.filter((q) => q.QuestionId !== questionToDelete.QuestionId)
      );
      setShowDeleteModal(false);
      setQuestionToDelete(null);
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

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
            width="24px"
            fill="#fff"
            viewBox="0 -960 960 960"
          >
            <path d="M417-417H166v-126h251v-251h126v251h251v126H543v251H417v-251Z" />
          </svg>
          Crear Encuesta
        </Link>
      </div>

      {/* Buscar */}
      <div className="search-container mb-4 w-50-lg">
        <span className="search-label">Buscar preguntas</span>
        <div className="search-input-group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            width="24px"
            fill="currentcolor"
            viewBox="0 -960 960 960"
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
              <th className="acciones-header">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentQuestions.map((q) => (
              <tr key={q.QuestionId}>
                <td>{q.QuestionId}</td>
                <td>{q.QuestionText}</td>
                <td className="acciones">
                  <button
                    className="btn-action edit"
                    title="Editar"
                    onClick={() => handleEditClick(q)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="#fff" viewBox="0 0 24 24">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42L18.37 3.29a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.83z"/>
                    </svg>
                  </button>
                  <button
                    className="btn-action delete"
                    title="Eliminar"
                    onClick={() => confirmDelete(q)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="#fff" viewBox="0 0 24 24">
                      <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1z"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Editar */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h3 className="modal-title">Editar Pregunta</h3>
            <form onSubmit={handleSubmit} className="modal-form">
              <label>Texto de la pregunta</label>
              <input
                type="text"
                value={selectedQuestion?.QuestionText || ""}
                onChange={(e) =>
                  setSelectedQuestion({
                    ...selectedQuestion,
                    QuestionText: e.target.value,
                  })
                }
                required
              />
              <div className="modal-buttons">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {showDeleteModal && questionToDelete && (
        <div className="modal-overlay">
          <div className="delete-modal new">
            <h3 className="delete-title">
              ¿Seguro que quieres eliminar esta pregunta?
            </h3>
            <div className="delete-actions centered">
              <button
                className="btn-cancel-delete"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button className="btn-gradient-delete" onClick={handleDelete}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Survey;
