import React, { useState } from 'react';
import HeaderAdm from "../../components/HeaderAdm";
import '../../components/components.css';
import { useNavigate } from "react-router-dom";

const ContractsAdmin = () => {
  const [contrato, setContrato] = useState('');
  const [contratoDescargar, setContratoDescargar] = useState('');
  const navigate = useNavigate();

  const handleCargarContrato = () => {
    // Aquí irá la lógica de cargar contrato
  };

  const handleEnviarContrato = () => {
    if (contrato.trim()) {
      // Aquí irá la lógica de enviar contrato
      setContrato('');
    }
  };

  const handleEliminarContrato = () => {
    setContrato('');
    // Aquí irá la lógica de eliminar contrato
  };

  const handleDescargar = () => {
    if (contratoDescargar.trim()) {
      // Aquí irá la lógica de descargar contrato
    }
  };

  const handleVerListado = () => {
    // Navega a la página del listado de contratos
    navigate('/ListContracts'); // Cambia esta ruta por la correcta
  };

  return (
    <div className="contrato-container mle-0">
      <HeaderAdm />
      
      <div className="contrato-wrapper mt-10 d-flex flex-column justify-center ">
        {/* Título principal */}
        
        {/* Sección de envío de contrato */}
        <div className="contrato-card mt-10 mx-auto">
          <h2 className="contrato-subtitle">
            Enviar Contrato
          </h2>
          
          {/* Campo de texto */}
          <div className="contrato-field">
            <div className="contrato-label">
              Contrato:
            </div>
            <div className="contrato-helper">
              CONTRATO N°
            </div>
          </div>
          
          {/* Botones internos */}
          <div className="contrato-actions">
            <button 
              onClick={handleCargarContrato} 
              className="btn-primary-custom"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor"><path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
              Cargar Contrato
            </button>
            
            <button 
              onClick={handleEnviarContrato} 
              className="btn-primary-custom"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor"><path d="M120-160v-640l760 320-760 320Zm66.67-102 520.66-218-520.66-220v158.67L428-480l-241.33 60v158Zm0 0v-438 438Z"/></svg>
              Enviar Contrato
            </button>
            
            <button 
              onClick={handleEliminarContrato} 
              className="btn-secondary-custom"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className='me-2' height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
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