import React, { useState } from 'react';
import HeaderAdm from "../components/HeaderAdm";
import '../components/components.css';

const ListEvents = () => {
  const [searchTerm, setSearchTerm] = useState('');

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
      agendadoPor: 'María García',
      estado: 'Confirmado'
    },
    {
      id: 3,
      fecha: '22/12/2024',
      hora: '16:15',
      nombreEvento: 'Reunión de equipo',
      agendadoPor: 'Carlos López',
      estado: 'En planeación'
    },
    {
      id: 4,
      fecha: '25/12/2024',
      hora: '09:00',
      nombreEvento: 'Evento de fin de año',
      agendadoPor: 'Ana Martínez',
      estado: 'Cancelado'
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
        return { color: '#059669' }; 
      case 'en planeación':
        return { color: '#d97706' }; 
      case 'en ejecución':
        return { color: '#dc2626' }; 
      default:
        return { color: '#4b5563' }; 
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="contact-section" style={{ minHeight: '100vh' }}>
      <HeaderAdm />
      
      <div style={{ 
        paddingTop: '100px', 
        padding: '100px 2rem 2rem 2rem',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <h1 className="section-title" style={{ fontSize: '2.5rem' }}>
          Listado de eventos
        </h1>
      
        <div style={{ marginBottom: '30px' }}>
          <div style={{ position: 'relative', maxWidth: '400px' }}>
            <span style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280',
              fontSize: '18px'
            }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Buscar eventos"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '45px',
                paddingRight: '20px',
                paddingTop: '12px',
                paddingBottom: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                outline: 'none',
                background: 'white'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgb(21, 165, 231)';
                e.target.style.boxShadow = '0 0 0 3px rgba(21, 165, 231, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>
        <div className="promo-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{
                  background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
                  borderBottom: '2px solid #dee2e6'
                }}>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Fecha
                  </th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Hora
                  </th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Nombre del evento
                  </th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Agendado por:
                  </th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Estado del evento
                  </th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {eventosFiltrados.map((evento, index) => (
                  <tr key={evento.id} 
                    style={{
                      borderBottom: index < eventosFiltrados.length - 1 ? '1px solid #f3f4f6' : 'none',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={{
                      padding: '16px 20px',
                      fontSize: '14px',
                      color: '#111827',
                      fontWeight: '500'
                    }}>
                      {evento.fecha}
                    </td>
                    <td style={{
                      padding: '16px 20px',
                      fontSize: '14px',
                      color: '#111827',
                      fontWeight: '500'
                    }}>
                      {evento.hora}
                    </td>
                    <td style={{
                      padding: '16px 20px',
                      fontSize: '14px',
                      color: '#111827',
                      fontWeight: '500'
                    }}>
                      {evento.nombreEvento}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: '#9ca3af',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '12px'
                        }}>
                          <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                            {getInitials(evento.agendadoPor)}
                          </span>
                        </div>
                        <span style={{ fontSize: '14px', color: '#111827', fontWeight: '500' }}>
                          {evento.agendadoPor}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{
                          width: '16px',
                          height: '16px',
                          marginRight: '8px',
                          fontSize: '14px'
                        }}>
              
                        </span>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          ...getEstadoColor(evento.estado)
                        }}>
                          {evento.estado}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <button className="btn-primary-custom" style={{
                        padding: '10px 20px',
                        fontSize: '14px'
                      }}>
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
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>
              No se encontraron eventos que coincidan con tu búsqueda.
            </p>
          </div>
        )}

        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
          <button className="btn-primary-custom" style={{
            padding: '15px 35px',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>+</span>
            <span>Agendar Evento</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListEvents;