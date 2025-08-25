import React, { useState } from 'react';
import HeaderAdm from "../../components/HeaderAdm";
import '../../components/components.css';
import '../../Uadmin/Contracts/Contrats.css';

const ContratoClienteComponent = () => {
  const [contrato, setContrato] = useState('');
  const [contratoDescargar, setContratoDescargar] = useState('');

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

  const handleDescargar = () => {
    if (contratoDescargar.trim()) {
      console.log('Descargando contrato:', contratoDescargar);
      alert('Contrato descargado exitosamente');
      // Aquí iría la lógica real de descarga
    } else {
      alert('Por favor, especifique el contrato a descargar');
    }
  };

  return (
    <div className="contrato-container">
      <div className="contrato-wrapper">
        {/* Título principal */}
        <h1 className="contrato-title">Contrato</h1>
        
        <div className="contrato-sections">
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
                Cargar contrato
              </button>
              
              <button onClick={handleEnviarContrato} className="contrato-button">
                Enviar Contrato
              </button>
              
              <button onClick={handleEliminarContrato} className="contrato-button">
                Eliminar contrato
              </button>
            </div>
          </div>

          {/* Sección de descarga de contrato */}
          <div className="contrato-box">
            <h2 className="contrato-subtitle">Descargar Contrato</h2>
            
            {/* Campo de texto */}
            <div className="contrato-field">
              <div className="contrato-label">Descargar Contrato:</div>
              <div className="contrato-hint">CONTRATO N°</div>
            </div>
            
            {/* Botón de descarga */}
            <div className="contrato-buttons">
              <button onClick={handleDescargar} className="contrato-button">
                Descargar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContratoClienteComponent;