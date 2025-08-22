import React, { useState } from 'react';
import HeaderAdm from "../components/HeaderAdm";
import '../components/components.css';
import './FormsEvent.css';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    nombreEvento: '',
    numeroDocumento: '',
    nombreCliente: '',
    direccion: '',
    telefonoCelular: '',
    segundoContacto: '',
    fechaEvento: '',
    descripcionEvento: '',
    metodoPago: {
      efectivo: false,
      tarjeta: false,
      transferencia: false
    },
    capacidadEvento: '',
    precioEvento: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('metodoPago.')) {
      const metodoPagoKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        metodoPago: { ...prev.metodoPago, [metodoPagoKey]: checked }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  return (
    <>
      <HeaderAdm />
      <div className="contact-section create-event-section">
        <div className="create-event-container">
          <h1 className="section-title create-event-title">Agendar Evento</h1>

          <div className="create-event-grid">
            {/* Columna izquierda */}
            <div className="create-event-column">
              <div className="form-field">
                <label className="form-label">
                  Nombre del evento <span>Campo Obligatorio</span>
                </label>
                <input
                  type="text"
                  name="nombreEvento"
                  value={formData.nombreEvento}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Numero de documento <span>Campo Obligatorio</span>
                </label>
                <input
                  type="text"
                  name="numeroDocumento"
                  value={formData.numeroDocumento}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Nombre del cliente <span>Campo Obligatorio</span>
                </label>
                <input
                  type="text"
                  name="nombreCliente"
                  value={formData.nombreCliente}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Dirección <span>Campo Obligatorio</span>
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Telefono celular <span>Campo Obligatorio</span>
                </label>
                <input
                  type="tel"
                  name="telefonoCelular"
                  value={formData.telefonoCelular}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Segundo contacto <span>Campo Obligatorio</span>
                </label>
                <input
                  type="tel"
                  name="segundoContacto"
                  value={formData.segundoContacto}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Asignar recursos <span>Campo Obligatorio</span>
                </label>
                <button className="btn-primary-custom btn-full">Seleccionar</button>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="create-event-column">
              <div className="form-field">
                <label className="form-label">
                  Fecha del evento <span>Campo Obligatorio</span>
                </label>
                <input
                  type="date"
                  name="fechaEvento"
                  value={formData.fechaEvento}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Descripción del evento <span>Campo Obligatorio</span>
                </label>
                <textarea
                  name="descripcionEvento"
                  value={formData.descripcionEvento}
                  onChange={handleInputChange}
                  rows={3}
                  className="form-textarea"
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Método de pago <span>Campo Obligatorio</span>
                </label>
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="checkbox"
                      name="metodoPago.efectivo"
                      checked={formData.metodoPago.efectivo}
                      onChange={handleInputChange}
                    />
                    Efectivo
                  </label>
                  <label className="payment-option">
                    <input
                      type="checkbox"
                      name="metodoPago.tarjeta"
                      checked={formData.metodoPago.tarjeta}
                      onChange={handleInputChange}
                    />
                    Tarjeta
                  </label>
                  <label className="payment-option">
                    <input
                      type="checkbox"
                      name="metodoPago.transferencia"
                      checked={formData.metodoPago.transferencia}
                      onChange={handleInputChange}
                    />
                    Transferencia
                  </label>
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">
                  Capacidad del evento <span>Campo Obligatorio</span>
                </label>
                <input
                  type="number"
                  name="capacidadEvento"
                  value={formData.capacidadEvento}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label">
                  Precio o paquete del evento <span>Campo Obligatorio</span>
                </label>
                <input
                  type="text"
                  name="precioEvento"
                  value={formData.precioEvento}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Botón Confirmar */}
          <div className="confirm-button">
            <button className="btn-primary-custom">Confirmar</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateEvent;
