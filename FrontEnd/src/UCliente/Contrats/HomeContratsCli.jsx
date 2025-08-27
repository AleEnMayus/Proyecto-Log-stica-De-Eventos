import React, { useState } from 'react';
import HeaderCl from "../../components/HeaderCl";
import '../../components/components.css';
import '../../Uadmin/Contracts/Contracts.css';

const ContratoClienteComponent = () => {
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
    <div className="contrato-container">
      <HeaderCl />
      
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

        {/* Sección adicional para descarga (opcional) */}
        <div className="contrato-section">
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
              className="btn-gradient"
            >
              Descargar
            </button>
          </div>
        </div>


      </div>
    </div>
  );
};

export default ContratoClienteComponent;