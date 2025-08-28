import React, { useState } from 'react';
import HeaderAdm from "../../components/HeaderAdm";
import '../../components/components.css';
import './Contracts.css';
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
    <div className="contrato-container">
      <HeaderAdm />
      
      <div className="contrato-wrapper">
        {/* Título principal */}
        <h1 className="contrato-title">
          Contrato
        </h1>
        
        {/* Sección de envío de contrato */}
        <div className="contrato-section">
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
              className="btn-gradient"
            >
              Cargar Contrato
            </button>
            
            <button 
              onClick={handleEnviarContrato} 
              className="btn-gradient"
            >
              Enviar Contrato
            </button>
            
            <button 
              onClick={handleEliminarContrato} 
              className="btn-gradient"
            >
              Eliminar contrato
            </button>
          </div>
        </div>

        {/* Botón externo */}
        <button 
          onClick={handleVerListado}
          className="btn-pink"
        >
          Ver Listado De Contratos
        </button>
      </div>
    </div>
  );
};

export default ContractsAdmin;