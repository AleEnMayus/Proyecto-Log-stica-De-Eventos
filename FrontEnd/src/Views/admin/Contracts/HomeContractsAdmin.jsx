import React, { useState } from 'react';
import HeaderAdm from "../../../components/HeaderSidebar/HeaderAdm";
import '../../CSS/components.css';
import { useNavigate } from "react-router-dom";

const ContractsAdmin = () => {
  const [contrato, setContrato] = useState(null);
  const navigate = useNavigate();

  const handleSendContract = async () => {
    if (!contrato) return;

    const formData = new FormData();
    formData.append("pdf", contrato); // aquí usamos el archivo guardado en state

    try {
      const response = await fetch("http://localhost:4000/api/upload-pdf", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Error al subir el contrato");
      }

      const data = await response.json();
      console.log("Respuesta del backend:", data);
      console.log("Enviando contrato:", contrato.name);

      setContrato(null);
    } catch (error) {
      console.error("Error subiendo contrato:", error);
    }
  };

  const handleEliminarContrato = () => {
    setContrato(null);
  };

  const handleVerListado = () => {
    navigate('/ListContracts');
  };

  return (
    <div className="contrato-container mle-0">
      <HeaderAdm />
      
      <div className="contrato-wrapper mt-10 d-flex flex-column justify-center ">
        
        {/* Sección de envío de contrato */}
        <div className="contrato-card mt-10 mx-auto">
          <h2 className="contrato-subtitle">
            Enviar Contrato
          </h2>
          
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
              <p><strong>Archivo seleccionado:</strong> {contrato.name}</p>
            ) : (
              <>
              <p>Arrastra y suelta un archivo aquí o haz clic para seleccionarlo</p>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor">
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
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor">
                <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
              </svg>
              Cargar Contrato
            </button>
            
            <button 
              onClick={handleSendContract} 
              className="btn-primary-custom"
              disabled={!contrato}
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor">
                <path d="M120-160v-640l760 320-760 320Zm66.67-102 520.66-218-520.66-220v158.67L428-480l-241.33 60v158Zm0 0v-438 438Z"/>
              </svg>
              Enviar Contrato
            </button>
            
            <button 
              onClick={handleEliminarContrato} 
              className="btn-secondary-custom"
              disabled={!contrato}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className='me-2' height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor">
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
              </svg>
              Eliminar contrato
            </button>
          </div>
        </div>

        {/* Botón externo */}
        <button 
          onClick={handleVerListado}
          className="btn-secondary-custom mx-auto "
        >
          Ver Listado De Contratos
        </button>
      </div>
    </div>
  );
};

export default ContractsAdmin;