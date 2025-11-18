import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeaderAdm from "../../../components/HeaderSidebar/HeaderAdm";
import "../../CSS/Lists.css";

import EditQuestion from "../../../components/Modals/EditQuestion"; 
import ConfirmModal from "../../../components/Modals/ModalConfirm";

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

  // Filtrar preguntas
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

  // Guardar cambios desde modal
  const handleSaveEdit = async (id, newText) => {
    try {
      const res = await fetch(`http://localhost:4000/api/questions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ QuestionText: newText }),
      });
      if (!res.ok) throw new Error("Error al actualizar la pregunta");

      setQuestions((prev) =>
        prev.map((q) => (q.QuestionId === id ? { ...q, QuestionText: newText } : q))
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

      {/* Header con botones */}
      <div className="list-header mt-5 pt-5">
        <h2 className="list-title">PREGUNTAS REGISTRADAS</h2>
        <div className="d-flex" style={{ display: "flex", gap: "12px" }}>
          <Link to="/SurvayHome/create" className="btn-create">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" fill="#fff" viewBox="0 -960 960 960">
              <path d="M417-417H166v-126h251v-251h126v251h251v126H543v251H417v-251Z" />
            </svg>
            Crear Encuesta
          </Link>

          <Link to="/SurvayHome/results" className="btn-status-custom status-active btn-create">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" fill="#fff" viewBox="0 -960 960 960">
              <path d="M417-417H166v-126h251v-251h126v251h251v126H543v251H417v-251Z" />
            </svg>
            Ver Resultados
          </Link>
        </div>
      </div>

      {/* Buscar */}
      <div className="search-container mb-4 w-50-lg">
        <span className="search-label">Buscar preguntas</span>
        <div className="search-input-group">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" fill="currentcolor" viewBox="0 -960 960 960">
            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
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

                {/* EDITAR */}
                <td className="Editar">
                  <button
                    className="btn-custom btn-edit-custom mx-auto"
                    onClick={() => handleEditClick(q)}
                    aria-label="Editar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                      <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"/>
                    </svg>
                  </button>
                </td>

                {/* ELIMINAR */}
                <td className="Eliminar">
                  <button
                    className="btn-custom btn-delete-custom mx-auto"
                    onClick={() => confirmDelete(q)}
                    aria-label="Eliminar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL EDITAR */}
      <EditQuestion
        show={showEditModal}
        question={selectedQuestion}
        onClose={() => {
          setShowEditModal(false);
          setSelectedQuestion(null);
        }}
        onSave={handleSaveEdit}
      />

      {/* MODAL CONFIRMACIÓN DELETE */}
      <ConfirmModal
        show={showDeleteModal}
        message="¿Seguro que deseas eliminar esta pregunta?"
        confirmText="Eliminar"
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Survey;
