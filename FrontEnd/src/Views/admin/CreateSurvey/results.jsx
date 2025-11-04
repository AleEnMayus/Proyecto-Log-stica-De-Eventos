import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../hooks/useToast";
import ToastContainer from "../../../components/ToastContainer";
import HeaderAdm from "../../../components/HeaderSidebar/HeaderAdm";
import "../../CSS/components.css";
import "../../CSS/FormsUser.css";

const Results = () => {
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/surveys", { mode: "cors" });
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("La respuesta del servidor no es JSON. Revisa tu backend.");
        }

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Error al cargar resultados");

        // Organizar los resultados por usuario y evento
        const organized = data.map(item => ({
          user: item.UserName,
          event: item.EventName,
          question: item.QuestionText,
          value: Number(item.NumericValue),
        }));

        // Ordenar primero por usuario, luego por evento
        organized.sort((a, b) => {
          if (a.user !== b.user) return a.user.localeCompare(b.user);
          if (a.event !== b.event) return a.event.localeCompare(b.event);
          return a.question.localeCompare(b.question);
        });

        setResults(organized);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar resultados:", err);
        addToast(err.message || "No se pudieron cargar los resultados", "danger");
        setLoading(false);
      }
    };

    fetchResults();
  }, [addToast]);

  const handleBack = () => {
    navigate("/SurvayHome");
  };

  return (
    <>
      <HeaderAdm />
      <div className="login-container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="login-form-card w-100">
          <h1 className="login-title">RESULTADOS DE ENCUESTAS</h1>

          {loading ? (
            <p className="text-center text-muted">Cargando resultados...</p>
          ) : results.length === 0 ? (
            <p className="text-center text-muted">No hay resultados disponibles.</p>
          ) : (
            <div className="results-container">
              {results.map((item, index) => (
                <div key={index} className="result-card">
                  <h5>
                    Usuario: <strong>{item.user}</strong> | Evento: <strong>{item.event}</strong>
                  </h5>
                  <p>
                    Pregunta: <strong>{item.question}</strong>
                  </p>
                  <p>
                    Valor: <strong>{item.value}</strong> ⭐
                  </p>
                  <div className="result-bar-container">
                    <div
                      className="result-bar"
                      style={{
                        width: `${Math.min(item.value * 20, 100)}%`,
                        backgroundColor:
                          item.value >= 4
                            ? "#10b981"
                            : item.value >= 3
                            ? "#facc15"
                            : "#ef4444",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleBack}>
              ← Volver
            </button>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
};

export default Results;
