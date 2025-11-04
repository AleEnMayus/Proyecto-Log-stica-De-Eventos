import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import HeaderCl from "../../components/HeaderSidebar/HeaderCl";
import "../CSS/FormsUser.css";

const ClientSurvey = () => {
  const { eventId } = useParams();
  const [userId, setUserId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [hover, setHover] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  // Preguntas por defecto en caso de que el endpoint falle
  const defaultQuestions = [
    { _qid: "1", _text: "¿Cómo calificarías la organización general del evento?" },
    { _qid: "2", _text: "¿Qué opinas sobre la calidad del servicio?" },
    { _qid: "3", _text: "¿Recomendarías este evento a otras personas?" },
    { _qid: "4", _text: "¿Cómo calificarías la atención recibida?" },
    { _qid: "5", _text: "¿El evento cumplió con tus expectativas?" }
  ];

  useEffect(() => {
    const getUserId = () => {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        return parseInt(storedUserId, 10);
      }
      return 4; // Usuario por defecto
    };

    setUserId(getUserId());
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoadingQuestions(true);
      console.log(" Intentando cargar preguntas...");
      
      const res = await fetch("http://localhost:4000/api/questions");
      
      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }
      
      const data = await res.json();
      console.log(" Preguntas cargadas:", data);

      let questionsToUse = [];
      
      if (data && Array.isArray(data) && data.length > 0) {
        // Usar preguntas del servidor
        questionsToUse = data.map((q, idx) => {
          const id = q?.QuestionId || q?._id || q?.id || `q_${idx}`;
          const text = q?.QuestionText || q?.text || q?.question || `Pregunta ${idx + 1}`;
          return { ...q, _qid: id, _text: text };
        });
        console.log(" Usando preguntas del servidor");
      } else {
        // Usar preguntas por defecto
        questionsToUse = defaultQuestions;
        console.log(" Usando preguntas por defecto");
      }

      // Inicializar respuestas
      const initialAnswers = {};
      questionsToUse.forEach((q) => {
        initialAnswers[q._qid] = 0;
      });

      setQuestions(questionsToUse);
      setAnswers(initialAnswers);
      
    } catch (err) {
      console.error(" Error cargando preguntas, usando preguntas por defecto:", err);
      
      // En caso de error, usar preguntas por defecto
      const initialAnswers = {};
      defaultQuestions.forEach((q) => {
        initialAnswers[q._qid] = 0;
      });
      
      setQuestions(defaultQuestions);
      setAnswers(initialAnswers);
    } finally {
      setLoadingQuestions(false);
    }
  };

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
    
    // Validaciones
    if (!userId) {
      alert("Error: No se encontró el ID de usuario");
      return;
    }

    if (!eventId) {
      alert("Error: No se encontró el ID del evento");
      return;
    }

    // Verificar que todas las preguntas tengan respuesta
    const unansweredQuestions = Object.entries(answers)
      .filter(([_, value]) => value === 0)
      .map(([qid]) => {
        const question = questions.find(q => q._qid === qid);
        return question ? question._text : `Pregunta ${qid}`;
      });

    if (unansweredQuestions.length > 0) {
      alert(`Por favor, responde las siguientes preguntas:\n${unansweredQuestions.join('\n')}`);
      return;
    }

    setLoading(true);

    try {
      console.log(" Enviando encuesta:", { 
        EventId: eventId, 
        UserId: userId, 
        Answers: answers 
      });

      const res = await fetch("http://localhost:4000/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          EventId: eventId,
          UserId: userId,
          Answers: answers,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Error al enviar la encuesta");
      }

      alert("¡Encuesta enviada con éxito! Gracias por tu feedback.");

      // Resetear respuestas
      const resetAnswers = {};
      questions.forEach((q) => {
        resetAnswers[q._qid] = 0;
      });
      setAnswers(resetAnswers);
      setHover({});

    } catch (err) {
      console.error(" Error al enviar encuesta:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="survey-main-container">
      <HeaderCl />
      <div className="survey-container">
        <h2 className="survey-title">Encuesta de Satisfacción</h2>
        <div className="debug-info" style={{fontSize: '12px', color: '#666', marginBottom: '10px'}}>
          ID de usuario: {userId} (Tipo: {typeof userId}) | ID de evento: {eventId}
          {loadingQuestions && " | Cargando preguntas..."}
        </div>
        
        <form onSubmit={handleSubmit} className="survey-form">
          {loadingQuestions ? (
            <p> Cargando preguntas...</p>
          ) : questions.length > 0 ? (
            questions.map((q, index) => (
              <div key={q._qid} className="survey-question-block">
                <p className="survey-question">
                  {index + 1}. {q._text}
                </p>
                <div className="stars">{renderStars(q._qid)}</div>
                <div className="rating-display" style={{fontSize: '14px', color: '#666', marginTop: '5px'}}>
                  Calificación seleccionada: <strong>{answers[q._qid] || 0}/5</strong>
                </div>
              </div>
            ))
          ) : (
            <p>No hay preguntas disponibles en este momento.</p>
          )}

          <button 
            type="submit" 
            className="survey-btn"
            disabled={loading || loadingQuestions || questions.length === 0}
            style={{
              opacity: (loading || loadingQuestions || questions.length === 0) ? 0.6 : 1,
              cursor: (loading || loadingQuestions || questions.length === 0) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? " Enviando..." : " Enviar Encuesta"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientSurvey;