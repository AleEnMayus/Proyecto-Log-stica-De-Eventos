import React, { useState } from 'react';
import HeaderAdm from "../../../components/HeaderSidebar/HeaderAdm";
import "../../CSS/components.css";
import "../../CSS/FormsUser.css";

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

  const itemsPerPage = 3;

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

    // Generar todas las páginas
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
    <div className="login-content mt-5 pt-5">
      <HeaderAdm />
      <div className="login-form-card contracts-card">
        {/* Título principal */}
        <h1 className="login-title">Listado De Contratos</h1>

        {/* Barra de búsqueda */}
        <div className="form-row form-input" style={{ marginBottom: 20 }}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor">
            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{ border: 0, outline: 'none', flex: 1 }}
          />
        </div>

        {/* Lista de contratos */}
        <div className="contratos-list">
          {getCurrentPageContratos().map((contrato) => (
            <div
              className="contrato-item form-row"
              key={contrato.id}
            >
              <div style={{ flex: 1 }}>
                <span className="contrato-text" style={{ color: '#2c3e50', fontWeight: 600 }}>
                  {contrato.texto}
                </span>
              </div>

              <div className="d-flex flex-column align-items-center contrato-actions" style={{ gap: 8 }}>
                <button
                  onClick={() => handleExpand(contrato.id)}
                  className="btn-secondary-custom"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="currentcolor"><path d="M480-313 287-506l43-43 120 120v-371h60v371l120-120 43 43-193 193ZM220-160q-24 0-42-18t-18-42v-143h60v143h520v-143h60v143q0 24-18 42t-42 18H220Z"/></svg>
                </button>
                <button
                  onClick={() => handleDelete(contrato.id)}
                  className="btn-cancel"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="currentcolor"><path d="M261-120q-24.75 0-42.37-17.63Q201-155.25 201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación (usa tus clases existente .pagination, .pagination-btn, .pagination-arrow) */}
        {totalPages > 1 && (
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
            <div className="pagination">
              {renderPaginationButtons()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractsList;