import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 Importa useNavigate
import HeaderAdm from "../../components/HeaderAdm";
import '../../components/components.css';
import '../../components/CSS/FormsUser.css';

const CreateEvent = () => {
  const navigate = useNavigate(); // 👈 Inicializa navigate

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('paymentMethod.')) {
      const paymentMethodKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        paymentMethod: { ...prev.paymentMethod, [paymentMethodKey]: checked }
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
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <>
      <HeaderAdm />
      <div className="login-container ps-lg-5 pe-lg-5 ps-1 pe-1">
        <div className="login-content ps-lg-5 pe-lg-5 ms-lg-5 me-lg-5">
          <button className="back-btn" onClick={() => window.history.back()}>
            ←
          </button>

          <h1 className="login-title">AGENDAR EVENTO</h1>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="row">
              <div className="col-md-6 mb-3">
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
                />
              </div>
              <div className="col-md-6 mb-3">
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
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
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
                />
              </div>
              <div className="col-md-6 mb-3">
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
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
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
                />
              </div>
              <div className="col-md-6 mb-3">
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
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Fecha del evento <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  name="eventDate"
                  className="form-input"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6 mb-3">
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
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
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
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Asignar recursos <span className="text-danger">*</span>
                </label>
                <button 
                  type="button"
                  className="btn-secondary-custom"
                  style={{ width: '100%' }}
                  onClick={() => navigate("/AssignResources")} 
                >
                  Seleccionar recursos
                </button>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 mb-3">
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
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 mb-3">
                <label className="form-label">
                  Método de pago <span className="text-danger">*</span>
                </label>
                <div className="payment-options" style={{ 
                  display: 'flex', 
                  gap: '20px', 
                  flexWrap: 'wrap',
                  marginTop: '10px'
                }}>
                  <label className="payment-option" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="paymentMethod.cash"
                      checked={formData.paymentMethod.cash}
                      onChange={handleInputChange}
                      style={{ margin: '0' }}
                    />
                    Efectivo
                  </label>
                  <label className="payment-option" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="paymentMethod.card"
                      checked={formData.paymentMethod.card}
                      onChange={handleInputChange}
                      style={{ margin: '0' }}
                    />
                    Tarjeta
                  </label>
                  <label className="payment-option" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="paymentMethod.transfer"
                      checked={formData.paymentMethod.transfer}
                      onChange={handleInputChange}
                      style={{ margin: '0' }}
                    />
                    Transferencia
                  </label>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between mt-4">
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
                Confirmar Evento
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateEvent;
