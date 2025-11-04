import React, { useState, useEffect } from "react";
import "../../Views/CSS/modals.css";       // Estilos del modal
import "../../Views/CSS/components.css";  // Botones primarios y secundarios

const EditQuestion = ({ show, question, onClose, onSave }) => {
  const [questionText, setQuestionText] = useState("");

  // Cargar el texto cuando llega la pregunta seleccionada
  useEffect(() => {
    if (question) {
      setQuestionText(question.QuestionText);
    }
  }, [question]);

  // Evitar render si no está abierto
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="profile-modal w-800">

        {/* Botón cerrar */}
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <h3 className="modal-title">Editar Pregunta</h3>

        <div className="pm-body" style={{ width: "100%" }}>
          <div className="pm-fields" style={{ width: "100%" }}>

            <div className="field-row">
              <div className="field">
                <label className="field-label">Texto de la pregunta</label>
                <input
                  type="text"
                  className="field-value"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Editar pregunta"
                  required
                />
              </div>
            </div>

            {/* Botones */}
            <div className="pm-footer">
              <button className="btn-secondary-custom btn" onClick={onClose}>
                Cancelar
              </button>

              <button
                className="btn-primary-custom btn"
                onClick={() => onSave(question.QuestionId, questionText)}
              >
                Guardar Cambios
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default EditQuestion;
