import React, { useState } from 'react';
import HeaderCl from "../../components/HeaderAdm";
import '../../components/components.css';
import '../../UCliente/Events/Events.css';
import HeaderAdm from '../../components/HeaderAdm';
import './CancelRequestModal.css'; // 👈 clases del modal de cancelación

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

    // Estados para el modal de solicitud de cancelación
    const [showCancelRequestModal, setShowCancelRequestModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    // Datos del evento y usuario (normalmente vendrían de props o API)
    const eventData = {
        nombreEvento: 'Cumpleaños Numero 36',
        nombreUsuario: 'Juan Pérez',
        numeroTelefono: '3123213456',
        correoElectronico: 'example@email.com'
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Función para mostrar el modal (esto se activaría cuando llegue una solicitud de cancelación)
    const showCancelRequest = () => {
        setShowCancelRequestModal(true);
    };

    // Función para cerrar el modal
    const closeCancelRequestModal = () => {
        setShowCancelRequestModal(false);
        setCancelReason('');
    };

    // Función para rechazar la solicitud
    const handleReject = () => {
        console.log('Solicitud de cancelación rechazada');
        alert('Solicitud de cancelación rechazada');
        closeCancelRequestModal();
    };

    // Función para aceptar la solicitud
    const handleAccept = () => {
        console.log('Solicitud de cancelación aceptada');
        setFormData(prev => ({
            ...prev,
            estadoEvento: 'Cancelado'
        }));
        alert('Solicitud de cancelación aceptada. El evento ha sido cancelado.');
        closeCancelRequestModal();
    };

    return (
        <div className="contact-section">
            <HeaderAdm />

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

                        {/* Botón temporal para probar el modal */}
                        <button
                            className="btn-primary-custom"
                            onClick={showCancelRequest}
                            style={{ backgroundColor: '#ef4444' }}
                        >
                            Simular Solicitud Cancelación
                        </button>
                    </div>

                    <div className="button-container">
                        <button className="btn-secondary-custom back-button">
                            Volver
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de Solicitud de Cancelación de Evento */}
            {showCancelRequestModal && (
                <div className="cancel-request-overlay">
                    <div className="cancel-request-modal">
                        {/* Botón cerrar */}
                        <button
                            onClick={closeCancelRequestModal}
                            className="cancel-request-close"
                        >
                            ×
                        </button>

                        {/* Título del modal */}
                        <h2 className="cancel-request-title">
                            Solicitud de cancelación de evento
                        </h2>

                        {/* Información del evento y usuario */}
                        <div className="cancel-request-info">
                            <div>
                                <div style={{ marginBottom: '15px' }}>
                                    <p className="label">Nombre del evento</p>
                                    <p className="value">{eventData.nombreEvento}</p>
                                </div>

                                <div>
                                    <p className="label">Nombre de usuario</p>
                                    <p className="value">{eventData.nombreUsuario}</p>
                                </div>
                            </div>

                            <div>
                                <div style={{ marginBottom: '15px' }}>
                                    <p className="label">Número telefónico</p>
                                    <p className="value">{eventData.numeroTelefono}</p>
                                </div>

                                <div>
                                    <p className="label">Correo electrónico</p>
                                    <p className="value">{eventData.correoElectronico}</p>
                                </div>
                            </div>
                        </div>

                        {/* Campo de motivo */}
                        <div style={{ marginBottom: '30px' }}>
                            <label className="cancel-request-reason-label">
                                Motivo
                            </label>

                            <div className="cancel-request-reason">
                                No puedo realizar el evento debido a problemas de salud que me impiden cumplir con mis responsabilidades profesionales en la fecha acordada.
                            </div>
                        </div>

                        <div className="cancel-request-actions">
                            <button className="cancel-request-btn accept-btn">
                                Aceptar
                            </button>
                            <button
                                className="cancel-request-btn reject-btn"
                                onClick={() => setShowCancelModal(false)}
                            >
                                Rechazar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventDetailsA;
