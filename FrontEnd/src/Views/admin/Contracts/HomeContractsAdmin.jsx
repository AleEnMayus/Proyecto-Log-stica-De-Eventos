import React, { useState } from "react";
import HeaderAdm from "../../../components/HeaderSidebar/HeaderAdm";
import "../../CSS/components.css";
import { useParams, useNavigate } from "react-router-dom";

const ContractsAdmin = () => {
  const { eventId } = useParams();
  const [contrato, setContrato] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // === Subir y enviar contrato ===
  const handleSendContract = async () => {
    if (!contrato) return alert("Selecciona un contrato PDF antes de enviar.");

    try {
      setLoading(true);

      // 🔍 Paso 1: Verificar si ya existe contrato asignado
      const verifyResponse = await fetch(`http://localhost:4000/api/contracts/by-event/${eventId}`);
      if (verifyResponse.ok) {
        const existing = await verifyResponse.json();
        if (existing.ContractRoute) {
          alert("⚠️ Este evento ya tiene un contrato asignado. No puedes reemplazarlo.");
          setLoading(false);
          return;
        }
      }

      // Paso 2: Preparar datos
      const formData = new FormData();
      formData.append("pdf", contrato);
      formData.append("eventId", eventId);

      // Paso 3: Subir al backend
      const response = await fetch("http://localhost:4000/api/contracts/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Error al subir el contrato");

      alert(
        `✅ Contrato enviado correctamente a ${data.data.emailSentTo}\nCódigo: ${data.data.contractNumber}`
      );

      setContrato(null);
    } catch (error) {
      console.error("Error subiendo contrato:", error);
      alert(error.message || "Ocurrió un error al subir el contrato");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarContrato = () => setContrato(null);
  const handleVerListado = () => navigate("/ListContracts");

  return (
    <div className="contrato-container mle-0">
      <HeaderAdm />

      <div className="contrato-wrapper mt-10 d-flex flex-column justify-center">
        <div className="contrato-card mt-10 mx-auto">
          <h2 className="contrato-subtitle">Enviar Contrato</h2>

          {/* Zona de Drop & Upload */}
          <div
            className="dropzone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) setContrato(file);
            }}
            onClick={() => document.getElementById("fileInput").click()}
          >
            {contrato ? (
              <p>
                <strong>Archivo seleccionado:</strong> {contrato.name}
              </p>
            ) : (
              <>
                <p>Arrastra y suelta un archivo aquí o haz clic para seleccionarlo</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="currentcolor"
                >
                  <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
                </svg>
              </>
            )}
            <input
              id="fileInput"
              type="file"
              accept=".pdf"
              onChange={(e) => setContrato(e.target.files[0])}
              style={{ display: "none" }}
            />
          </div>

          {/* Botones internos */}
          <div className="contrato-actions">
            <button
              onClick={() => document.getElementById("fileInput").click()}
              className="btn-primary-custom"
              disabled={loading}
            >
              📄 Cargar Contrato
            </button>

            <button
              onClick={handleSendContract}
              className="btn-primary-custom"
              disabled={!contrato || loading}
            >
              {loading ? "Enviando..." : "📤 Enviar Contrato"}
            </button>

            <button
              onClick={handleEliminarContrato}
              className="btn-secondary-custom"
              disabled={!contrato || loading}
            >
              🗑️ Eliminar contrato
            </button>
          </div>
        </div>

        <button
          onClick={handleVerListado}
          className="btn-secondary-custom mx-auto"
        >
          📁 Ver Listado De Contratos
        </button>
      </div>
    </div>
  );
};

export default ContractsAdmin;