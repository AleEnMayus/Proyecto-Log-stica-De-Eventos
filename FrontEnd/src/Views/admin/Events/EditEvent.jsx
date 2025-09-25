import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderAdm from "../../../components/HeaderSidebar/HeaderAdm";
import '../../CSS/components.css';
import '../../CSS/FormsUser.css';

const EditEvent = () => {
  const { eventId } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos del evento al montar el componente
  useEffect(() => {
    if (eventId) {
      fetchEventData(eventId);
    }
  }, [eventId]);

  const fetchEventData = async (id) => {
    try {
      setLoading(true);

      // DATOS DE PRUEBA - Reemplaza con tu API
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockData = {
          eventName: 'Cumpleaños Numero 36',
          documentNumber: '123456789',
          clientName: 'Juan Pérez',
          address: 'Avenida 68 Num°123, Bogotá D.C.',
          cellPhone: '3123213456',
          secondContact: '3109876543',
          eventDate: '2023-10-15',
          eventDescription: 'Celebración de cumpleaños número 36 con decoración temática',
          paymentMethod: {
            cash: false,
            card: true,
            transfer: false
          },
          eventCapacity: '50',
          eventPrice: '500000'
        };

        setFormData(mockData);
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/events/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar los datos del evento');
      }

      const data = await response.json();
      setFormData(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching event data:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async () => {
    try {
      // Validar campos requeridos
      const requiredFields = ['eventName', 'documentNumber', 'clientName', 'address', 'cellPhone', 'eventDate', 'eventCapacity', 'eventPrice'];
      const missingFields = requiredFields.filter(field => !formData[field]);

      if (missingFields.length > 0) {
        alert('Por favor complete todos los campos requeridos');
        return;
      }

      // Verificar que al menos un método de pago esté seleccionado
      const hasPaymentMethod = Object.values(formData.paymentMethod).some(method => method === true);
      if (!hasPaymentMethod) {
        alert('Por favor seleccione al menos un método de pago');
        return;
      }

      console.log('Actualizando evento:', formData);

      // Aquí harías la llamada a tu API para actualizar
      // const response = await fetch(`/api/events/${eventId}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData)
      // });

      // if (response.ok) {
      //   alert('Evento actualizado exitosamente');
      //   navigate(`/EventsHomeAdmin/Details/${eventId}`);
      // }

      // Simulación de éxito
      alert('Evento actualizado exitosamente');
      navigate(`/EventsHomeAdmin/Details/${eventId}`);

    } catch (error) {
      console.error('Error al actualizar evento:', error);
      alert('Error al actualizar el evento');
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <>
        <HeaderAdm />
        <div className="login-container ps-lg-5 pe-lg-5 ps-1 pe-1">
          <div className="login-content ps-lg-5 pe-lg-5 ms-lg-5 me-lg-5">
            <div style={{ textAlign: 'center', padding: '50px' }}>
              Cargando datos del evento...
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <HeaderAdm />
        <div className="login-container ps-lg-5 pe-lg-5 ps-1 pe-1">
          <div className="login-content ps-lg-5 pe-lg-5 ms-lg-5 me-lg-5">
            <div style={{ textAlign: 'center', padding: '50px' }}>
              Error: {error}
              <br />
              <button
                onClick={() => fetchEventData(eventId)}
                className="btn-primary-custom"
                style={{ marginTop: '20px' }}
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderAdm />
      <div className="login-container container  mt-10">
        <div className="login-form-card w-800">
          <button className="back-btn" onClick={() => window.history.back()}>
            ←
          </button>

          <h1 className="login-title">EDITAR EVENTO</h1>

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
                <select
                  name="AdvancePaymentMethod"
                  className="form-select form-input"
                  value={formData.AdvancePaymentMethod}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione un método</option>
                  <option value="Cash">Efectivo</option>
                  <option value="Card">Tarjeta</option>
                  <option value="Transfer">Transferencia</option>
                </select>
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
                Actualizar Evento
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditEvent;