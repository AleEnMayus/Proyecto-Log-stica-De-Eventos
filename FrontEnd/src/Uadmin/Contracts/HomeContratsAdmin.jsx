import React, { useState } from 'react';
import HeaderAdm from "../../components/HeaderAdm";
import '../../components/components.css';
import './Contrats.css';

const ContratoComponent = () => {
  const [contrato, setContrato] = useState('');

  const handleCargarContrato = () => {
    console.log('Cargando contrato');
    alert('Función de cargar contrato');
  };

  const handleEnviarContrato = () => {
    if (contrato.trim()) {
      console.log('Enviando contrato:', contrato);
      alert('Contrato enviado exitosamente');
      setContrato('');
    } else {
      alert('Por favor, ingrese el contenido del contrato');
    }
  };

  const handleEliminarContrato = () => {
    setContrato('');
    console.log('Contrato eliminado');
    alert('Contrato eliminado');
  };

  const handleVerListado = () => {
    console.log('Mostrando listado de contratos');
    alert('Mostrando listado de contratos');
  };

  return (
    <div className="contrato-container">
      <div className="contrato-wrapper">
        {/* Título principal */}
        <h1 className="contrato-title">Contrato</h1>
        
        {/* Sección de envío de contrato */}
        <div className="contrato-box">
          <h2 className="contrato-subtitle">Enviar Contrato</h2>
          
          {/* Campo de texto */}
          <div className="contrato-field">
            <div className="contrato-label">Contrato:</div>
            <div className="contrato-hint">CONTRATO N°</div>
          </div>
          
          {/* Botones de acción dentro del recuadro */}
          <div className="contrato-buttons">
            <button onClick={handleCargarContrato} className="contrato-button">
              Cargar Contrato
            </button>
            
            <button onClick={handleEnviarContrato} className="contrato-button">
              Enviar Contrato
            </button>
            
            <button onClick={handleEliminarContrato} className="contrato-button">
              Eliminar contrato
            </button>
          </div>
        </div>
        
        {/* Botón de listado fuera del recuadro */}
        <button onClick={handleVerListado} className="contrato-button full">
          Ver Listado De Contratos
        </button>
      </div>
    </div>
  );
};

export default ContratoComponent;
