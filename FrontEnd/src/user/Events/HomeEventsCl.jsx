import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderCl from '../../components/HeaderCl';
import '../../components/components.css';
import '../../components/CSS/Lists.css';

const ListEventsC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const eventsPerPage = 5;

  const events = [
    {
      id: 1,
      date: '15/12/2024',
      time: '14:30',
      eventName: 'Conferencia de Marketing Digital',
      createdBy: 'Juan Pérez',
      status: 'En planeación'
    },
    {
      id: 2,
      date: '20/12/2024',
      time: '10:00',
      eventName: 'Workshop de React',
      createdBy: 'Juan Pérez',
      status: 'En ejecución'
    }
  ];

  const filteredEvents = events.filter(event =>
    event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.createdBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'terminado':
        return { color: '#ff0000ff' };
      case 'en planeación':
        return { color: '#03ff25ff' };
      case 'en ejecución':
        return { color: '#ffae00ff' };
      default:
        return { color: '#4b5563' };
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleViewEvent = (eventId) => {
    navigate(`/EventDetails/${eventId}`);
  };

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const paginationContainer = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '20px 0',
    gap: '8px'
  };

  const paginationBtn = (isActive = false) => ({
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    fontSize: '14px',
    fontWeight: isActive ? '600' : '500',
    color: isActive ? '#fff' : '#333',
    background: isActive
      ? 'linear-gradient(135deg, #00aaff, #0077ff)'
      : '#f0f0f0',
    transition: 'all 0.3s ease'
  });

  const paginationArrow = {
    ...paginationBtn(),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  return (
    <div className="list-container mle-0">
      <HeaderCl />

      {/* Header */}
      <div className="list-header mt-5 pt-5">
        <h2 className="list-title">LISTADO DE EVENTOS</h2>
      </div>

      {/* Search */}
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
              <th>Organizador</th>
              <th>Estado</th>
              <th>Ver</th>
            </tr>
          </thead>
          <tbody>
            {currentEvents.map((event) => (
              <tr key={event.id}>
                <td>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: '600', color: '#2c3e50' }}>{event.date}</div>
                    <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>{event.time}</div>
                  </div>
                </td>
                <td>
                  <span style={{ fontWeight: '500', color: '#2c3e50' }}>
                    {event.eventName}
                  </span>
                </td>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">{getInitials(event.createdBy)}</div>
                    <span className="user-name">{event.createdBy}</span>
                  </div>
                </td>
                <td>
                  <span
                    className="btn-custom btn-status-custom"
                    style={getStatusColor(event.status)}
                  >
                    {event.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-custom btn-view-custom"
                    onClick={() => handleViewEvent(event.id)}
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
      <div style={paginationContainer}>
        <button
          style={paginationArrow}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          &lt;
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              style={paginationBtn(currentPage === i + 1)}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          style={paginationArrow}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>

      {/* Empty state */}
      {filteredEvents.length === 0 && (
        <div className="empty-state">
          <p>No se encontraron eventos que coincidan con tu búsqueda.</p>
        </div>
      )}
    </div>
  );
};

export default ListEventsC;
