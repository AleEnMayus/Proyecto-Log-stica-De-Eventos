import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderAdm from "../../../components/HeaderSidebar/HeaderAdm";
import "../../CSS/components.css";
import "../../CSS/FormsUser.css";

const CreateSurvay = () => {
  const [questions, setQuestions] = useState([""]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const addQuestion = () => {
    if (questions.length < 5) {
      setQuestions((prev) => [...prev, ""]);
    }
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index] = value;
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    if (questions.some((q) => q.trim() === "")) {
      setError("Llena todos los campos de Pregunta.");
      return;
    }
    setError("");

    try {
      // Enviar preguntas al backend
      const response = await fetch("http://localhost:4000/api/questions/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions }), // el backend espera { questions: [...] }
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Error al guardar encuesta");
      }

      const data = await response.json();
      console.log("Respuesta del backend:", data);

      navigate("/SurvayHome"); // redirigir al home
    } catch (err) {
      console.error(err);
      setError("No se pudo crear la encuesta. Intenta de nuevo.");
    }
  };

  const handleCancel = () => {
    navigate("/SurvayHome");
  };

  const starCount = Math.min(questions.length, 5);

  return (
    <div className="login-content mt-5 pt-5">
      <HeaderAdm />
      <div className="login-form-card mt-5">
        <h2 className="login-title">Crear Encuesta</h2>

        {/* Estrellas dinámicas */}
        <div
          className="survay-stars"
          style={{ textAlign: "center", marginBottom: "20px" }}
        >
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              width="24"
              height="24"
              style={{ margin: "0 3px", color: i < starCount ? "#ffc107" : "#e0e0e0" }}
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                fill="currentColor"
              />
            </svg>
          ))}
        </div>

        {/* Inputs de preguntas */}
        {questions.map((q, index) => (
          <div key={index} style={{ position: "relative" }}>
            <input
              type="text"
              placeholder={`Título de la pregunta ${index + 1}`}
              className="form-input"
              value={q}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
            />
            {index > 0 && (
              <button
                type="button"
                aria-label="Eliminar pregunta"
                onClick={() => removeQuestion(index)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
                title="Eliminar pregunta"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="#888"
                >
                  <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.9 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.9a1 1 0 0 0 1.41-1.41L13.41 12l4.9-4.89a1 1 0 0 0-.01-1.4z" />
                </svg>
              </button>
            )}
          </div>
        ))}

        {error && <p className="text-danger">{error}</p>}

        {questions.length < 5 && (
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={addQuestion}>
              ＋ Agregar pregunta
            </button>
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="btn-primary-custom"
            onClick={handleSubmit}
          >
            Crear
          </button>
          <button type="button" className="btn-cancel" onClick={handleCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSurvay;
