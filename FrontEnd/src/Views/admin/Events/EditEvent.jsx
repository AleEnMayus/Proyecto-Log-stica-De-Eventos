import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderAdm from "../../../components/HeaderSidebar/HeaderAdm";
import { useToast } from "../../../hooks/useToast";
import ToastContainer from "../../../components/ToastContainer";
import EditAssignResourcesModal from "../Resource/EditAllocateResources";

import "../../CSS/components.css";
import "../../CSS/FormsUser.css";

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const [formData, setFormData] = useState({
    EventName: "",
    ClientIdentifier: "",
    Address: "",
    Capacity: "",
    EventPrice: "",
    EventDateTime: "",
    EventDescription: "",
    AdvancePaymentMethod: "",
    resources: [],
  });

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Obtener evento existente
  const fetchEventData = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/api/events/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Error al cargar el evento");

      const data = await response.json();
      
      // Formatear la fecha para datetime-local
      if (data.EventDateTime) {
        const date = new Date(data.EventDateTime);
        data.EventDateTime = date.toISOString().slice(0, 16);
      }
      
      setFormData(data);
    } catch (err) {
      addToast(err.message || "Error cargando evento", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) fetchEventData(eventId);
  }, [eventId]);

  // Manejar cambios de input
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  // Guardar cambios
  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/events/${eventId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Error ${response.status}`);
      }

      addToast(data.message || "Evento actualizado", "success");
      setTimeout(() => navigate(`/EventsHomeAdmin/Details/${eventId}`), 2000);
    } catch (error) {
      console.error("Error actualizando evento:", error);
      addToast(error.message || "Error al actualizar el evento", "danger");
    }
  };

  const handleCancel = () => navigate(-1);

  // Formatear recursos para el modal
  const getPreselectedResources = () => {
    if (!formData.resources || formData.resources.length === 0) return [];
    
    return formData.resources.map(resource => ({
      resourceId: resource.ResourceId,
      quantity: resource.AssignedQuantity,
      status: resource.AssignmentStatus,
      price: resource.Prices
    }));
  };

  if (loading) {
    return (
      <>
        <HeaderAdm />
        <div className="login-container">
          <div className="login-content text-center p-5">
            Cargando datos del evento...
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderAdm />
      <div className="login-container container mt-10">
        <div className="login-form-card w-800">
          <h1 className="login-title">EDITAR EVENTO</h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
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
                  Seleccionar recursos ({formData.resources?.length || 0})
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
              <button type="submit" className="btn-primary-custom">
                Actualizar Evento
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {showModal && (
        <div className="modal-overlay">
          <EditAssignResourcesModal
            onClose={() => setShowModal(false)}
            preselected={getPreselectedResources()}
            onSave={(selectedResources) => {
              console.log("Resources guardados:", selectedResources);
              setFormData(prev => ({ 
                ...prev, 
                resources: selectedResources.map(r => ({
                  ResourceId: r.resourceId,
                  AssignedQuantity: r.quantity,
                  AssignmentStatus: r.status,
                  Prices: r.price
                }))
              }));
              setShowModal(false);
              addToast("Recursos actualizados", "success");
            }}
          />
        </div>
      )}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
};

export default EditEvent;