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
    ClientIdentifier: '',
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
  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        EventStatus: "In_planning", // tu API lo espera
        CreationDate: new Date().toISOString().slice(0, 19).replace('T', ' ')
      };

      console.log("Payload enviado:", payload);

      const response = await fetch("http://localhost:4000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Respuesta backend:", data);

      alert("Evento agendado exitosamente");
      navigate("/EventsHomeAdmin");
    } catch (error) {
      console.error("Error enviando evento:", error);
      alert("Hubo un problema al agendar el evento");
    }
  };


  const handleCancel = () => {
    navigate('/EventsHomeAdmin');
  };

  return (<>
    <HeaderAdm />
    <div className="login-container mt-10">
      <div className="login-content container">
        <div className="login-form-card form-container-custom w-800">
          <button className="back-btn" onClick={() => window.history.back()}>
            ←
          </button>
          <h1 className="login-title">AGENDAR EVENTO</h1>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="row">
              <div className="col-md-6 mb-3">
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
              <div className="col-md-6 mb-3">
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

            <div className="row">
              <div className="col-md-12 mb-3">
                <label className="form-label">Cliente (correo o documento) *</label>
                <input
                  type="text"
                  name="ClientIdentifier"
                  className="form-input"
                  value={formData.ClientIdentifier || ""}
                  onChange={handleInputChange}
                  placeholder="Ej: cliente@correo.com o 12345678"
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
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
              <div className="col-md-6 mb-3">
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

            <div className="row">
              <div className="col-md-6 mb-3">
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
              <div className="col-md-6 mb-3 d-flex align-items-center">
                <button
                  type="button"
                  className="btn-secondary-custom w-100"
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
                Agendar Evento
              </button>
            </div>
          </form>
        </div>
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