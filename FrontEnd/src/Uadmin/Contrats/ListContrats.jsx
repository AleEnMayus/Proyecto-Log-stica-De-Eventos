import React, { useState } from 'react';
import './ContratsList.css';

const ListadoContratosComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Datos de ejemplo para los contratos
  const contratos = [
    { id: 1, texto: 'Contrato 4° Cliente 4 Nombre Evento' },
    { id: 2, texto: 'Contrato 4° Cliente 4 Nombre Evento' },
    { id: 3, texto: 'Contrato 4° Cliente 4 Nombre Evento' },
    { id: 4, texto: 'Contrato 4° Cliente 4 Nombre Evento' },
    { id: 5, texto: 'Contrato 5° Cliente 5 Nombre Evento' },
    { id: 6, texto: 'Contrato 6° Cliente 6 Nombre Evento' },
    { id: 7, texto: 'Contrato 7° Cliente 7 Nombre Evento' },
    { id: 8, texto: 'Contrato 8° Cliente 8 Nombre Evento' },
  ];

  const itemsPerPage = 4;
  const totalPages = Math.ceil(contratos.length / itemsPerPage);

  const filteredContratos = contratos.filter(contrato =>
    contrato.texto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCurrentPageContratos = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredContratos.slice(startIndex, endIndex);
  };

  const handleExpand = (contratoId) => {
    console.log('Expandir contrato:', contratoId);
    alert(`Expandir contrato ${contratoId}`);
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

    // Botones de páginas (ejemplo con 1 a 4 + ... + 10 y 11)
    for (let i of [1, 2, 3, 4, 10, 11]) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
      if (i === 4) {
        buttons.push(
          <span key="dots" className="pagination-dots">
            ...
          </span>
        );
      }
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
      <div className="listado-wrapper">
        {/* Título principal */}
        <h1 className="listado-title">Listado De Contratos</h1>
        
        {/* Barra de búsqueda */}
        <div className="search-container">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        {/* Lista de contratos */}
        <div className="contratos-list">
          {getCurrentPageContratos().map((contrato) => (
            <div key={contrato.id} className="contrato-item">
              <span className="contrato-text">{contrato.texto}</span>
              <div className="contrato-actions">
                <button
                  onClick={() => handleExpand(contrato.id)}
                  className="contrato-action expand"
                >
                  Expandir
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

export default ListadoContratosComponent;
