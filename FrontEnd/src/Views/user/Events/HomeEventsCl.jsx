import React, { useState } from 'react';  
import { Link, useNavigate } from 'react-router-dom';
import HeaderCl from "../../../components/HeaderSidebar/HeaderCl";
import '../../CSS/Lists.css';
import '../../CSS/components.css';

const ListEventsC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const eventsPerPage = 5;

  const eventos = [
    {
      id: 1,
      fecha: '15/12/2024',
      hora: '14:30',
      nombreEvento: 'Conferencia de Marketing Digital',
      agendadoPor: 'Juan Pérez',
      estado: 'En planeación'
    },
    {
      id: 2,
      fecha: '20/12/2024',
      hora: '10:00',
      nombreEvento: 'Workshop de React',
      agendadoPor: 'Juan Pérez',
      estado: 'En ejecución'
    }
  ];

  const eventosFiltrados = eventos.filter(evento =>
    evento.nombreEvento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evento.agendadoPor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evento.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEstadoColor = (estado) => {
    switch (estado.toLowerCase()) {
      case 'terminado':
        return { color: '#ff0000ff' };
      case 'en planeación':
        return { color: '#13a927ff' };
      case 'en ejecución':
        return { color: '#ffae00ff' };
      default:
        return { color: '#6c757d' };
    }
  };

  const handleVerEvento = (eventId) => {
    navigate(`/EventsHome/Details/${eventId}`);
  };

  // Paginación
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = eventosFiltrados.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(eventosFiltrados.length / eventsPerPage);

  return (
    <div className="list-container">
      <HeaderCl />

      {/* Header */}
      <div className="list-header mt-5 pt-5">
        <h2 className="list-title">LISTADO DE TUS EVENTOS</h2>
        <Link to="/Schedule" className="btn-create">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffffff">
            <path d="M417-417H166v-126h251v-251h126v251h251v126H543v251H417v-251Z" />
          </svg>
          Agendar Cita
        </Link>
      </div>

      {/* Search Bar */}
      <div className="search-container mb-4 w-50-lg">
        <span className="search-label">Buscar eventos</span>
        <div className="search-input-group">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor">
            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por evento, organizador o estado..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="list-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Nombre del evento</th>
              <th>Estado</th>
              <th>Ver</th>
            </tr>
          </thead>
          <tbody>
            {currentEvents.map((evento) => (
              <tr key={evento.id}>
                <td>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: '600', color: '#2c3e50' }}>{evento.fecha}</div>
                    <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>{evento.hora}</div>
                  </div>
                </td>
                <td>
                  <span style={{ fontWeight: '500', color: '#2c3e50' }}>
                    {evento.nombreEvento}
                  </span>
                </td>
                <td>
                  <span
                    className="btn-custom btn-status-custom"
                    style={getEstadoColor(evento.estado)}
                  >
                    {evento.estado}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-custom btn-view-custom"
                    onClick={() => handleVerEvento(evento.id)}
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          className="pagination-arrow"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor">
            <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
          </svg>
        </button>

        <div className="pagination-numbers">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          className="pagination-arrow"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor">
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
          </svg>
        </button>
      </div>

      {/* Empty State */}
      {eventosFiltrados.length === 0 && (
        <div className="empty-state">
          <p>No se encontraron eventos que coincidan con tu búsqueda.</p>
        </div>
      )}
    </div>
  );
};

export default ListEventsC;