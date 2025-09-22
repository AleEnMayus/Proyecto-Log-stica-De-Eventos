import React, { useState, useEffect } from "react";
import HeaderCl from "./components/HeaderSidebar/HeaderCl";
import "./Views/CSS/FormsUser.css";

const ClientSurvey = () => {
  const [questions, setQuestions] = useState([]); // preguntas normalizadas
  const [answers, setAnswers] = useState({});     // { questionId: 0..5 }
  const [hover, setHover] = useState({});         // preview al pasar el mouse

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/questions");
        const data = await res.json();

        // Normalizar IDs y texto para evitar inconsistencias del backend
        const normalized = data.map((q, idx) => {
          const id = q?.QuestionID ?? q?.questionId ?? q?.id ?? q?._id ?? `q_${idx}`;
          const text = q?.QuestionText ?? q?.questionText ?? q?.text ?? `Pregunta ${idx + 1}`;
          return { ...q, _qid: id, _text: text };
        });

        const initialAnswers = {};
        normalized.forEach((q) => {
          initialAnswers[q._qid] = 0;
        });

        // DEBUG (quita si quieres): ver en consola lo que llega
        console.log("Questions normalized:", normalized);
        console.log("Initial answers:", initialAnswers);

        setQuestions(normalized);
        setAnswers(initialAnswers);
      } catch (err) {
        console.error("Error al obtener preguntas:", err);
      }
    };

    fetchQuestions();
  }, []);

  // Render de 5 estrellas por pregunta. keys únicas y comportamiento correcto.
  const renderStars = (questionId) => {
  const rating = answers[questionId] ?? 0;
  const preview = hover[questionId] ?? 0;
  const display = preview || rating;

  return Array.from({ length: 5 }, (_, i) => {
    const value = i + 1;
    return (
      <svg
        key={`${questionId}-${i}`}
        onClick={() =>
          setAnswers((prev) => ({ ...prev, [questionId]: value }))
        }
        onMouseEnter={() =>
          setHover((prev) => ({ ...prev, [questionId]: value }))
        }
        onMouseLeave={() =>
          setHover((prev) => ({ ...prev, [questionId]: 0 }))
        }
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        width="28"
        height="28"
        style={{
          margin: "0 3px",
          cursor: "pointer",
          color: value <= display ? "#ffc107" : "#e0e0e0",
          transition: "color 0.2s ease",
        }}
      >
        <path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          fill="currentColor"
        />
      </svg>
    );
  });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5173/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) throw new Error("Error al enviar la encuesta");
      const result = await res.json();
      alert(`Encuesta enviada con éxito\n${JSON.stringify(result)}`);

      // reset
      const reset = {};
      Object.keys(answers).forEach(k => (reset[k] = 0));
      setAnswers(reset);
    } catch (err) {
      console.error("Error:", err);
      alert("No se pudo enviar la encuesta");
    }
  };

  return (
    <div className="survey-main-container">
      <HeaderCl />
      <div className="survey-container">
        <h2 className="survey-title">Encuesta de Satisfacción</h2>
        <form onSubmit={handleSubmit} className="survey-form">
          {questions.length > 0 ? (
            questions.map((q) => (
              <div key={q._qid} className="survey-question-block">
                <p className="survey-question">{q._text}</p>
                <div className="stars">{renderStars(q._qid)}</div>
              </div>
            ))
          ) : (
            <p>No hay preguntas disponibles.</p>
          )}

          <button type="submit" className="survey-btn">Enviar Encuesta</button>
        </form>
      </div>
    </div>
  );
};

export default ClientSurvey;