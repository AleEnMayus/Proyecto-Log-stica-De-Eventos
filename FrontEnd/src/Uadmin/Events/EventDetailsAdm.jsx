import React, { useState } from 'react';
import HeaderCl from "../../components/HeaderAdm";
import '../../components/components.css';
import '../../UCliente/Events/Events.css';
import HeaderAdm from '../../components/HeaderAdm';

const EventDetailsA = () => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="contact-section">
      <HeaderAdm/>
      
      <div className="content-container">
        
        <div className="user-card">
          <div className="user-info">
            <div className="avatar">
            </div>
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
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            marginBottom: '30px',
            width: '100%'
          }}>
            <button className="btn-primary-custom">
              Editar evento
            </button>

            <button className="btn-primary-custom">
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
    </div>
  );
};

export default EventDetailsA;
