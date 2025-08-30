import React, { useState } from 'react';
import HeaderAdm from "../../components/HeaderAdm";
import '../../components/components.css';
import './ContractsList.css';

const ContractsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Datos de ejemplo para los contratos
  const contratos = [
    { id: 1, texto: 'Contrato 1° Cliente 1 Nombre Evento' },
    { id: 2, texto: 'Contrato 2° Cliente 2 Nombre Evento' },
    { id: 3, texto: 'Contrato 3° Cliente 3 Nombre Evento' },
    { id: 4, texto: 'Contrato 4° Cliente 4 Nombre Evento' },
    { id: 5, texto: 'Contrato 5° Cliente 5 Nombre Evento' },
    { id: 6, texto: 'Contrato 6° Cliente 6 Nombre Evento' },
    { id: 7, texto: 'Contrato 7° Cliente 7 Nombre Evento' },
    { id: 8, texto: 'Contrato 8° Cliente 8 Nombre Evento' },
    { id: 9, texto: 'Contrato 9° Cliente 9 Nombre Evento' },
    { id: 10, texto: 'Contrato 10° Cliente 10 Nombre Evento' },
    { id: 11, texto: 'Contrato 11° Cliente 11 Nombre Evento' },
    { id: 12, texto: 'Contrato 12° Cliente 12 Nombre Evento' },
    { id: 13, texto: 'Contrato 13° Cliente 13 Nombre Evento' },
    { id: 14, texto: 'Contrato 14° Cliente 14 Nombre Evento' },
    { id: 15, texto: 'Contrato 15° Cliente 15 Nombre Evento' },
    { id: 16, texto: 'Contrato 16° Cliente 16 Nombre Evento' },
  ];

  const itemsPerPage = 4;
  
  const filteredContratos = contratos.filter(contrato =>
    contrato.texto.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredContratos.length / itemsPerPage);

  const getCurrentPageContratos = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredContratos.slice(startIndex, endIndex);
  };

  const handleExpand = (contratoId) => {
    console.log('Descargar contrato:', contratoId);
    alert(`Descargar contrato ${contratoId}`);
  };

  const handleDelete = (contratoId) => {
    console.log('Eliminar contrato:', contratoId);
    alert(`Eliminar contrato ${contratoId}`);
  };
  
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    
    // Botón anterior
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-arrow"
      >
        «
      </button>
    );

    // Generar todas las páginas que realmente existen
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    // Botón siguiente
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-arrow"
      >
        »
      </button>
    );

    return buttons;
  };

  return (
    <div className="listado-container">
      <HeaderAdm />
      <div className="listado-wrapper">
        {/* Título principal */}
        <h1 className="listado-title">Listado De Contratos</h1>
        
        {/* Barra de búsqueda */}
        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="contratos-list">
          {getCurrentPageContratos().map((contrato) => (
            <div key={contrato.id} className="contrato-item">
              <span className="contrato-text">{contrato.texto}</span>
              <div className="contrato-actions">
                <button
                  onClick={() => handleExpand(contrato.id)}
                  className="contrato-action expand"
                >
                  Descargar
                </button>
                <button
                  onClick={() => handleDelete(contrato.id)}
                  className="contrato-action delete"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Paginación */}
        <div className="pagination">{renderPaginationButtons()}</div>
      </div>
    </div>
  );
};

export default ContractsList;