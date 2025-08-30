import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import HeaderCl from "../../components/HeaderCl";
import '../../components/components.css';
import './Events.css';

const ListEventsC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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
    switch(estado.toLowerCase()) {
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

  const handleVerEvento = () => {
    navigate('/EventDetails');
  };

  return (
    <div className="contact-section">
      <HeaderCl />
      
      <div className="list-container">
        <h1 className="section-title">
          Listado de eventos
        </h1>
      
        <div className="search-container">
          <div className="search-wrapper">
            <span className="search-icon"></span>
            <input
              type="text"
              placeholder="Buscar eventos"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="promo-card table-container">
          <div className="table-wrapper">
            <table className="events-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Nombre del evento</th>
                  <th>Agendado por:</th>
                  <th>Estado del evento</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {eventosFiltrados.map((evento, index) => (
                  <tr key={evento.id}>
                    <td>{evento.fecha}</td>
                    <td>{evento.hora}</td>
                    <td>{evento.nombreEvento}</td>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">
                          <span>{getInitials(evento.agendadoPor)}</span>
                        </div>
                        <span className="user-name">{evento.agendadoPor}</span>
                      </div>
                    </td>
                    <td>
                      <div className="status-cell">
                        <span className="status-icon"></span>
                        <span className="status-label" style={getEstadoColor(evento.estado)}>
                          {evento.estado}
                        </span>
                      </div>
                    </td>
                    <td>
                      <button 
                        className="btn-primary-custom event-button"
                        onClick={handleVerEvento}>
                        Ver evento
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {eventosFiltrados.length === 0 && (
          <div className="empty-state">
            <p>No se encontraron eventos que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListEventsC;