import React, { useState } from 'react';
import HeaderAdm from "../components/HeaderAdm";
import '../components/components.css';

const EventDetails = () => {
  const [formData, setFormData] = useState({
    correoElectronico: 'example@email.com',
    nombreCliente: '',
    telefonoContacto: '',
    numeroDocumento: '',
    ubicacionEvento: '',
    tipoDocumento: '',
    fechaEvento: '',
    tematicaEvento: '',
    horaEvento: '',
    paqueteSeleccionado: '',
    metodoPago: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="contact-section" style={{ minHeight: '100vh' }}>
      <HeaderAdm />
      
      <div style={{ 
        paddingTop: '100px', 
        padding: '100px 2rem 2rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '40px',
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '12px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#9ca3af',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '20px'
          }}>
            <span style={{ 
              color: 'white', 
              fontSize: '32px',
              fontWeight: 'bold' 
            }}>
              👤
            </span>
          </div>
          <div>
            <h3 style={{ 
              color: '#6b7280', 
              fontSize: '16px',
              fontWeight: '500',
              margin: '0 0 8px 0'
            }}>
              Correo electronico
            </h3>
            <p style={{ 
              color: '#111827', 
              fontSize: '18px',
              fontWeight: '600',
              margin: 0
            }}>
              {formData.correoElectronico}
            </p>
          </div>
        </div>

        <div className="promo-card">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '30px',
            marginBottom: '40px'
          }}>
            
            <div>
              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  display: 'block',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  Nombre del cliente:
                </label>
                <div style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#6b7280'
                }}>
                  Text
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  display: 'block',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  Número de documento:
                </label>
                <div style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#6b7280'
                }}>
                  Content
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  display: 'block',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  Tipo de documento:
                </label>
                <div style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#6b7280'
                }}>
                  Content
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  display: 'block',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  Temática del evento:
                </label>
                <div style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#6b7280'
                }}>
                  Content
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  display: 'block',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  Paquete Seleccionado:
                </label>
                <div style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#6b7280'
                }}>
                  Content
                </div>
              </div>
            </div>
            <div>
              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  display: 'block',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  Teléfono de Contacto:
                </label>
                <div style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#6b7280'
                }}>
                  Text
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  display: 'block',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  Ubicación del Evento:
                </label>
                <div style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#6b7280'
                }}>
                  Content
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  display: 'block',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  Fecha del Evento:
                </label>
                <div style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#6b7280'
                }}>
                  Content
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  display: 'block',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  Hora del Evento:
                </label>
                <div style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#6b7280'
                }}>
                  Content
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  display: 'block',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  Método de Pago:
                </label>
                <div style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#6b7280'
                }}>
                  Content
                </div>
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap',
            marginBottom: '20px'
          }}>
            <button className="btn-secondary-custom" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '16px' }}>🗑️</span>
              Cancelar evento
            </button>

            <button style={{
              background: '#6b7280',
              border: 'none',
              borderRadius: '25px',
              padding: '10px 25px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              color: 'white',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#4b5563';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#6b7280';
            }}
            >
              Editar evento
            </button>

            <button style={{
              background: '#6b7280',
              border: 'none',
              borderRadius: '25px',
              padding: '10px 25px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              color: 'white',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#4b5563';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#6b7280';
            }}
            >
              Editar Estado de Evento
            </button>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button style={{
              background: '#6b7280',
              border: 'none',
              borderRadius: '25px',
              padding: '12px 60px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#4b5563';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#6b7280';
              e.target.style.transform = 'translateY(0)';
            }}
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;