import React, { useState } from 'react';
import HeaderCl from "../../../components/HeaderSidebar/HeaderCl";
import '../../CSS/components.css';

const ContractsClient = () => {
  const [contrato, setContrato] = useState('');
  const [contratoDescargar, setContratoDescargar] = useState('');

  const handleCargarContrato = () => {
    console.log('Cargando contrato');
    // Aquí irá la lógica de cargar contrato
  };

  const handleEnviarContrato = () => {
    if (contrato.trim()) {
      console.log('Enviando contrato:', contrato);
      setContrato('');
      // Aquí irá la lógica de enviar contrato
    } else {
      alert('Por favor, complete el contrato');
    }
  };

  const handleEliminarContrato = () => {
    setContrato('');
    console.log('Contrato eliminado');
    // Aquí irá la lógica de eliminar contrato
  };

  const handleDescargar = () => {
    if (contratoDescargar.trim()) {
      console.log('Descargando contrato:', contratoDescargar);
      // Aquí irá la lógica de descargar contrato
    } else {
      alert('Por favor, especifique el contrato a descargar');
    }
  };

  const handleVerListado = () => {
    console.log('Ver listado de contratos');
    // Aquí irá la lógica para ver listado
  };

  return (
    <div className="contrato-container mt-10">
      <HeaderCl />
      
      <div className="contrato-wrapper">
        {/* Título principal */}

        {/* Sección adicional para descarga */}
        <div className="contrato-card">
          <h2 className="contrato-subtitle">
            Descargar Contrato
          </h2>
          
          <div className="contrato-field">
            <div className="contrato-label">
              Contrato a descargar:
            </div>
            <div className="contrato-helper">
              CONTRATO N°
            </div>
          </div>
          
          <div className="contrato-actions">
            <button 
              onClick={handleDescargar} 
              className="btn-primary-custom"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
              Descargar
            </button>
          </div>
        </div>

        {/* Sección de envío de contrato */}
        <div className="contrato-card">
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
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor"><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/></svg>
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

        


      </div>
    </div>
  );
};

export default ContractsClient;