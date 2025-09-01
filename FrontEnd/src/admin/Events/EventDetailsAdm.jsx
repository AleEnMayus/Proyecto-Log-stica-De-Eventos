import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../components/components.css';
import '../../components/CSS/DetailsEvt.css';
import HeaderAdm from '../../components/HeaderAdm';
import ModalState from '../../components/ModalState';

const EventDetailsA = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showStateModal, setShowStateModal] = useState(false);

  // Función para obtener los detalles del evento
  const fetchEventDetails = async (id) => {
    try {
      setLoading(true);
      setError(null);

      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockData = {
          eventId: 1,
          names: 'Juan Pérez',
          email: 'juan.perez@email.com',
          phone: '3123213456',
          documentNumber: '123456789',
          documentType: 'C.C.',
          address: 'Avenida 68 Num°123, Bogotá D.C.',
          eventDate: '15/10/2023',
          eventName: 'Cumpleaños Numero 36',
          eventTime: '9:00 AM',
          selectedPackage: '1',
          paymentMethod: 'Daviplata',
          eventStatus: 'En planeación'
        };

        setEventData(mockData);
        return;
      }

      const response = await fetch(`/api/events/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('La respuesta no es JSON válido');
      }

      const data = await response.json();
      setEventData(data);
    } catch (err) {
      console.error('Error fetching event details:', err);

      if (err.message.includes('JSON')) {
        setError('Error: El servidor no devolvió datos válidos');
      } else if (err.message.includes('404')) {
        setError('Evento no encontrado');
      } else if (err.message.includes('500')) {
        setError('Error interno del servidor');
      } else {
        setError(`Error al cargar el evento: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchEventDetails(eventId);
    }
  }, [eventId]);

  const handleEditEvent = () => {
    navigate(`/EditEvent/${eventId}`);
  };

  // Abrir modal
  const handleOpenStatusModal = () => {
    setShowStateModal(true);
  };

  // Confirmar cambio de estado
  const handleStatusChangeFromModal = (eventId, newStatus) => {
    console.log("Estado cambiado:", eventId, "->", newStatus);

    // Actualizar estado local
    setEventData(prev => ({
      ...prev,
      eventStatus: newStatus
    }));

    // Aquí harías tu request al backend para guardar el cambio
    // await updateEventStatus(eventId, newStatus);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
        <div className="content-container">
        <HeaderAdm />
          <div className="loading-message">
            Cargando detalles del evento...
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="content-container">
        <HeaderAdm />
          <div className="error-message">
            Error: {error}
            <button onClick={() => fetchEventDetails(eventId)} className="btn-primary-custom">
              Reintentar
            </button>
          </div>
        </div>
    );
  }

  if (!eventData) {
    return (
        <div className="content-container">
        <HeaderAdm />
          <div className="no-data-message">
            No se encontraron detalles para este evento.
          </div>
        </div>
    );
  }

  return (

      <div className="content-container mle-0">
      <HeaderAdm />

        <div className="user-card">
          <div className="user-info">
            <div className="avatar"></div>
            <div>
              <p className="user-label">Correo electrónico</p>
              <p className="user-email">{eventData.email || 'N/A'}</p>
            </div>
          </div>

          <div className="event-status">
            <h4 className="status-title">Estado del evento</h4>
            <div className="status-indicator">
              <div className="status-dot"></div>
              <span className="status-text">{eventData.eventStatus || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="promo-card">
          <div className="details-grid">
            {/* Datos del evento */}
            <div>
              <div className="detail-item">
                <label className="detail-label">Nombre del cliente:</label>
                <div className="detail-box">{eventData.names || 'N/A'}</div>
              </div>

              <div className="detail-item">
                <label className="detail-label">Número de documento:</label>
                <div className="detail-box">{eventData.documentNumber || 'N/A'}</div>
              </div>

              <div className="detail-item">
                <label className="detail-label">Tipo de documento:</label>
                <div className="detail-box">{eventData.documentType || 'N/A'}</div>
              </div>

              <div className="detail-item">
                <label className="detail-label">Temática del evento:</label>
                <div className="detail-box">{eventData.eventName || 'N/A'}</div>
              </div>

              <div className="detail-item">
                <label className="detail-label">Paquete Seleccionado:</label>
                <div className="detail-box">{eventData.selectedPackage || 'N/A'}</div>
              </div>
            </div>

            <div>
              <div className="detail-item">
                <label className="detail-label">Teléfono de Contacto:</label>
                <div className="detail-box">{eventData.phone || 'N/A'}</div>
              </div>

              <div className="detail-item">
                <label className="detail-label">Ubicación del Evento:</label>
                <div className="detail-box">{eventData.address || 'N/A'}</div>
              </div>

              <div className="detail-item">
                <label className="detail-label">Fecha del Evento:</label>
                <div className="detail-box">{eventData.eventDate || 'N/A'}</div>
              </div>

              <div className="detail-item">
                <label className="detail-label">Hora del Evento:</label>
                <div className="detail-box">{eventData.eventTime || 'N/A'}</div>
              </div>

              <div className="detail-item">
                <label className="detail-label">Método de Pago:</label>
                <div className="detail-box">{eventData.paymentMethod || 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            marginBottom: '30px',
            width: '100%'
          }}>
            <button
              className="btn-primary-custom"
              onClick={handleEditEvent}
            >
              Editar evento
            </button>

            <button
              className="btn-primary-custom"
              onClick={handleOpenStatusModal}
            >
              Editar Estado de Evento
            </button>
          </div>

          <div className="button-container">
            <button
              className="btn-secondary-custom back-button"
              onClick={handleGoBack}
            >
              Volver
            </button>
          </div>
        </div>
      {/* Modal de estado */}
      <ModalState
        show={showStateModal}
        onClose={() => setShowStateModal(false)}
        onConfirm={handleStatusChangeFromModal}
        currentStatus={eventData.eventStatus}
        entityId={eventData.eventId}
        options={["En planeación", "En ejecución", "Finalizado"]}
        title="Cambiar estado de evento"
      />
      </div>
  );
};

export default EventDetailsA;
