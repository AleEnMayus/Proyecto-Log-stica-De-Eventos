import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { eraseUnderscore } from '../../../utils/FormatText';
import '../../CSS/components.css';
import '../../CSS/Lists.css';
import HeaderAdm from '../../../components/HeaderSidebar/HeaderAdm';

const ListEventsA = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const eventsPerPage = 5;

  // Traer eventos desde API
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/events");
        if (!res.ok) throw new Error("Error al obtener eventos");
        const data = await res.json();
        setEventos(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventos();
  }, []);

  // Filtro
  const eventosFiltrados = eventos.filter(evento =>
    evento.EventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evento.EventStatus?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Colores de estado
  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'completed':
        return { color: '#ff0000ff' };
      case 'in_planning':
        return { color: '#13a927ff' };
      case 'in_execution':
        return { color: '#ffae00ff' };
      default:
        return { color: '#6c757d' };
    }
  };

  // Ver evento
  const handleVerEvento = (eventId) => {
    navigate(`/EventsHomeAdmin/Details/${eventId}`);
  };

  // Paginación
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = eventosFiltrados.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(eventosFiltrados.length / eventsPerPage);

  // Loading
  if (loading) {
    return (
      <div className="list-container mle-0">
        <HeaderAdm />
        <p className="mt-5 pt-5 text-center">Cargando eventos...</p>
      </div>
    );
  }

  return (
    <div className="list-container mle-0">
      <HeaderAdm />

      {/* Header */}
      <div className="list-header mt-5 pt-5">
        <h2 className="list-title">LISTADO DE EVENTOS</h2>
        <Link to="/CreateEvent" className="btn-create">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffffff">
            <path d="M417-417H166v-126h251v-251h126v251h251v126H543v251H417v-251Z" />
          </svg>
          Agendar Evento
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
            placeholder="Buscar por evento o estado..."
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
              <th>Cliente</th> {/* nueva columna */}
              <th>Estado</th>
              <th>Ver</th>
            </tr>
          </thead>

          <tbody>
            {currentEvents.map((evento) => {
              const fecha = new Date(evento.EventDateTime).toLocaleDateString();
              const hora = new Date(evento.EventDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <tr key={evento.EventId}>
                  <td>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: '600', color: '#2c3e50' }}>{fecha}</div>
                      <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>{hora}</div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: '500', color: '#2c3e50' }}>
                      {evento.EventName}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: '500', color: '#34495e' }}>
                      {evento.ClientName || "Desconocido"}
                    </span>
                  </td>
                  <td>
                    <span
                      className="btn-custom btn-status-custom"
                      style={getEstadoColor(evento.EventStatus)}
                    >
                      {eraseUnderscore(evento.EventStatus)}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-custom btn-edit-custom d-flex align-items-center mx-auto"
                      onClick={() => handleVerEvento(evento.EventId)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              );
            })}
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
          ◀
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
          ▶
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

export default ListEventsA;