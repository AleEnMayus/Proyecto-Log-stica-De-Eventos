import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderCl from "../../components/HeaderAdm";
import '../../components/components.css';
import '../../UCliente/Events/Events.css';
import './EventState.css'; // 

const EventState = () => {
  const [formData, setFormData] = useState({
    correoElectronico: 'example@email.com',
    nombreCliente: 'James Herrid',
    telefonoContacto: '',
    numeroDocumento: '',
    ubicacionEvento: '',
    tipoDocumento: '',
    fechaEvento: '',
    tematicaEvento: '',
    horaEvento: '',
    paqueteSeleccionado: '',
    metodoPago: '',
    estadoEvento: 'En planeación'
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openModal = () => {
    setSelectedStatus(formData.estadoEvento);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStatus('');
  };

  const handleStatusChange = () => {
    if (selectedStatus) {
      setFormData(prev => ({
        ...prev,
        estadoEvento: selectedStatus
      }));
      closeModal();
    }
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
  };

  const handleEditEvent = () => {
    navigate('/edit-event');
  };

  return (
    <div className="contact-section">
      <HeaderCl/>
      
      <div className="content-container">
        
        <div className="user-card">
          <div className="user-info">
            <div className="avatar"></div>
            <div>
              <h4 className="user-label">Nombre de usuario</h4>
              <p className="user-name">Juan Pérez</p>
              <p className="user-label">Correo electrónico</p>
              <p className="user-email">example@email.com</p>
            </div>
          </div>
          
          <div className="event-status">
            <h4 className="status-title">Estado del evento</h4>
            <div className="status-indicator">
              <div className="status-dot"></div>
              <span className="status-text">{formData.estadoEvento}</span>
            </div>
          </div>
        </div>

        <div className="promo-card">
          <div className="details-grid">
            
            <div>
              <div className="detail-item">
                <label className="detail-label">Nombre del cliente:</label>
                <div className="detail-box">Juan Pérez</div>
              </div>

              <div className="detail-item">
                <label className="detail-label">Número de documento:</label>
                <div className="detail-box">123456789</div>
              </div>

              <div className="detail-item">
                <label className="detail-label">Tipo de documento:</label>
                <div className="detail-box">C.C.</div>
              </div>

              <div className="detail-item">
                <label className="detail-label">Temática del evento:</label>
                <div className="detail-box">Cumpleaños Numero 36</div>
              </div>

              <div className="detail-item">
                <label className="detail-label">Paquete Seleccionado:</label>
                <div className="detail-box">1</div>
              </div>
            </div>
            
            <div>
              <div className="detail-item">
                <label className="detail-label">Teléfono de Contacto:</label>
                <div className="detail-box">3123213456</div>
              </div>

              <div className="detail-item">
                <label className="detail-label">Ubicación del Evento:</label>
                <div className="detail-box">Avenida 68 Num°123, Bogotá D.C.</div>
              </div>

              <div className="detail-item">
                <label className="detail-label">Fecha del Evento:</label>
                <div className="detail-box">15/10/2023</div>
              </div>

              <div className="detail-item">
                <label className="detail-label">Hora del Evento:</label>
                <div className="detail-box">9:00 AM</div>
              </div>

              <div className="detail-item">
                <label className="detail-label">Método de Pago:</label>
                <div className="detail-box">Daviplata</div>
              </div>
            </div>
          </div>
          
          <div className="event-actions">
            <button 
              className="btn-primary-custom"
              onClick={handleEditEvent}
            >
              Editar evento
            </button>

            <button 
              className="btn-primary-custom"
              onClick={openModal}
            >
              Editar Estado de Evento
            </button>
          </div>
          
          <div className="button-container">
            <button className="btn-secondary-custom back-button">
              Volver
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">

            <button 
              onClick={closeModal}
              className="modal-close"
            >
              ×
            </button>

            <h2 className="modal-title">Cambiar estado</h2>

            <div className="status-options">
              <div 
                onClick={() => handleStatusSelect('En planeación')}
                className={`status-option ${selectedStatus === 'En planeación' ? 'selected-planning' : ''}`}
              >
                <div className={`status-box ${selectedStatus === 'En planeación' ? 'checked-planning' : ''}`}>
                  {selectedStatus === 'En planeación' && <span className="checkmark">✓</span>}
                </div>
                <span className="status-label">En planeación</span>
              </div>

              <div 
                onClick={() => handleStatusSelect('En ejecución')}
                className={`status-option ${selectedStatus === 'En ejecución' ? 'selected-execution' : ''}`}
              >
                <div className={`status-box ${selectedStatus === 'En ejecución' ? 'checked-execution' : ''}`}>
                  {selectedStatus === 'En ejecución' && <span className="checkmark">✓</span>}
                </div>
                <span className="status-label">En ejecución</span>
              </div>

              <div 
                onClick={() => handleStatusSelect('Finalizado')}
                className={`status-option ${selectedStatus === 'Finalizado' ? 'selected-finished' : ''}`}
              >
                <div className={`status-box ${selectedStatus === 'Finalizado' ? 'checked-finished' : ''}`}>
                  {selectedStatus === 'Finalizado' && <span className="checkmark">✓</span>}
                </div>
                <span className="status-label">Finalizado</span>
              </div>
            </div>

            <div className="confirm-container">
              <button 
                onClick={handleStatusChange}
                disabled={!selectedStatus}
                className={`confirm-button ${selectedStatus ? 'active' : 'disabled'}`}
              >
                Cambiar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventState;