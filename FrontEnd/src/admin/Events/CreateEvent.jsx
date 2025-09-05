import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAdm from "../../components/HeaderAdm";
import AssignResources from "../Resource/AllocateResources";
import '../../components/components.css';
import '../../components/CSS/FormsUser.css';
import '../../components/CSS/Modals.css'; // asegúrate de tener el css del modal

const CreateEvent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    eventName: '',
    documentNumber: '',
    clientName: '',
    address: '',
    cellPhone: '',
    secondContact: '',
    eventDate: '',
    eventDescription: '',
    paymentMethod: {
      cash: false,
      card: false,
      transfer: false
    },
    eventCapacity: '',
    eventPrice: ''
  });

  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('paymentMethod.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        paymentMethod: { ...prev.paymentMethod, [key]: checked }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = () => {
    console.log('Form data:', formData);
    alert('Evento agendado exitosamente');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <>
      <HeaderAdm />
      <div className="login-container d-flex justify-content-center" style={{ marginTop: "80px", padding: "20px" }}>
        <div className="form-container-custom">
          <h1 className="login-title">AGENDAR EVENTO</h1>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="form-row">
              <div className="form-col">
                <label className="form-label">
                  Nombre del evento <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="eventName"
                  className="form-input"
                  placeholder="Ingresa el nombre del evento"
                  value={formData.eventName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-col">
                <label className="form-label">
                  Número de documento <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="documentNumber"
                  className="form-input"
                  placeholder="Ej: 1234567890"
                  value={formData.documentNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <label className="form-label">
                  Nombre del cliente <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="clientName"
                  className="form-input"
                  placeholder="Ingresa el nombre del cliente"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-col">
                <label className="form-label">
                  Dirección <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  className="form-input"
                  placeholder="Ingresa la dirección del evento"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <label className="form-label">
                  Teléfono celular <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  name="cellPhone"
                  className="form-input"
                  placeholder="Ej: +57 300 123 4567"
                  value={formData.cellPhone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-col">
                <label className="form-label">
                  Segundo contacto <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  name="secondContact"
                  className="form-input"
                  placeholder="Ej: +57 300 987 6543"
                  value={formData.secondContact}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <label className="form-label">
                  Fecha del evento <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  name="eventDate"
                  className="form-input"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-col">
                <label className="form-label">
                  Capacidad del evento <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  name="eventCapacity"
                  className="form-input"
                  placeholder="Ej: 50 personas"
                  value={formData.eventCapacity}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <label className="form-label">
                  Precio o paquete del evento <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="eventPrice"
                  className="form-input"
                  placeholder="Ej: $500,000 COP"
                  value={formData.eventPrice}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-col">
                <label className="form-label">
                  Asignar recursos <span className="text-danger">*</span>
                </label>
                <button
                  type="button"
                  className="btn-secondary-custom"
                  style={{ width: '100%' }}
                  onClick={() => setShowModal(true)}
                >
                  Seleccionar recursos
                </button>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Descripción del evento <span className="text-danger">*</span>
              </label>
              <textarea
                name="eventDescription"
                className="form-input"
                placeholder="Describe los detalles del evento..."
                value={formData.eventDescription}
                onChange={handleInputChange}
                rows={4}
                style={{ resize: 'vertical' }}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-12 mb-3">
                <label className="form-label d-block mb-2">
                  Método de pago <span className="text-danger">*</span>
                </label>
                <div
                  className="payment-options d-flex justify-content-center gap-5 flex-wrap"
                  style={{ marginTop: "10px" }}
                >
                  <label className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      name="paymentMethod.cash"
                      checked={formData.paymentMethod.cash}
                      onChange={handleInputChange}
                      className="custom-checkbox"
                    />
                    <span className="checkmark"></span>
                    <span className="ms-2">Efectivo</span>
                  </label>

                  <label className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      name="paymentMethod.card"
                      checked={formData.paymentMethod.card}
                      onChange={handleInputChange}
                      className="custom-checkbox"
                    />
                    <span className="checkmark"></span>
                    <span className="ms-2">Tarjeta</span>
                  </label>

                  <label className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      name="paymentMethod.transfer"
                      checked={formData.paymentMethod.transfer}
                      onChange={handleInputChange}
                      className="custom-checkbox"
                    />
                    <span className="checkmark"></span>
                    <span className="ms-2">Transferencia</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary-custom"
              >
                Agendar Evento
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal con AssignResources */}
      {showModal && (
        <div className="modal-overlay">
          <div className="profile-modal">
            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            <div className="pm-body">
              <h3 className="text-center mb-3">Asignar Recursos</h3>
              <AssignResources />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateEvent;
