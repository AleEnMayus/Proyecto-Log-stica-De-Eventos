import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAdm from "../../../components/HeaderSidebar/HeaderAdm";
import AssignResourcesModal from "../Resource/AllocateResources";
import '../../CSS/components.css';
import '../../CSS/FormsUser.css';
import '../../CSS/Modals.css';

const CreateEvent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    EventName: '',
    ClientId: null, // puede ser null
    Address: '',
    Capacity: '',
    EventPrice: '',
    EventDateTime: '',
    EventDescription: '',
    AdvancePaymentMethod: '', // será string (Cash, Transfer, Card)
    Contract: null, // puede ser null
    ContractNumber: '',
    resources: [] // puede estar vacío
  });

  const [showModal, setShowModal] = useState(false);

  // Manejo de cambios
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("AdvancePaymentMethod.")) {
      const key = name.split(".")[1];
      setFormData(prev => {
        let method = prev.AdvancePaymentMethod;

        if (checked) method = key; // solo un método seleccionado
        else method = ''; 

        return { ...prev, AdvancePaymentMethod: method };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value
      }));
    }
  };

  // Submit
  const handleSubmit = () => {
    const payload = {
      ...formData,
      CreationDate: new Date().toISOString().slice(0, 19).replace('T', ' '), // formato YYYY-MM-DD hh:mm:ss
    };

    console.log("Payload enviado:", payload);
    alert("Evento agendado exitosamente");
    // Aquí va el fetch/axios para enviar al backend
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
                <label className="form-label">Nombre del evento *</label>
                <input
                  type="text"
                  name="EventName"
                  className="form-input"
                  value={formData.EventName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-col">
                <label className="form-label">Dirección *</label>
                <input
                  type="text"
                  name="Address"
                  className="form-input"
                  value={formData.Address}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <label className="form-label">Fecha y hora *</label>
                <input
                  type="datetime-local"
                  name="EventDateTime"
                  className="form-input"
                  value={formData.EventDateTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-col">
                <label className="form-label">Capacidad *</label>
                <input
                  type="number"
                  name="Capacity"
                  className="form-input"
                  value={formData.Capacity}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <label className="form-label">Precio *</label>
                <input
                  type="number"
                  name="EventPrice"
                  className="form-input"
                  value={formData.EventPrice}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-col">
                <label className="form-label">Asignar recursos</label>
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
              <label className="form-label">Descripción *</label>
              <textarea
                name="EventDescription"
                className="form-input"
                value={formData.EventDescription}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label d-block">Método de pago *</label>
              <div className="payment-options d-flex gap-4">
                <label>
                  <input
                    type="radio"
                    name="AdvancePaymentMethod.cash"
                    checked={formData.AdvancePaymentMethod === "Cash"}
                    onChange={handleInputChange}
                  /> Efectivo
                </label>
                <label>
                  <input
                    type="radio"
                    name="AdvancePaymentMethod.card"
                    checked={formData.AdvancePaymentMethod === "Card"}
                    onChange={handleInputChange}
                  /> Tarjeta
                </label>
                <label>
                  <input
                    type="radio"
                    name="AdvancePaymentMethod.transfer"
                    checked={formData.AdvancePaymentMethod === "Transfer"}
                    onChange={handleInputChange}
                  /> Transferencia
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>Cancelar</button>
              <button type="submit" className="btn-primary-custom">Agendar Evento</button>
            </div>
          </form>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <AssignResourcesModal
            onClose={() => setShowModal(false)}
            onSave={(ids) => {
              console.log("Resources guardados:", ids);
              setFormData(prev => ({ ...prev, resources: ids }));
              setShowModal(false);
            }}
          />
        </div>
      )}
    </>
  );
};

export default CreateEvent;