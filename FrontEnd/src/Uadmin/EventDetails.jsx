import React, { useState } from 'react';
import HeaderAdm from "../components/HeaderAdm";
import '../components/components.css';

const EventDetails = () => {
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
          justifyContent: 'space-between',
          marginBottom: '40px',
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#9ca3af',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '15px',
              color: 'white',
              fontSize: '20px',
              fontWeight: '600'
            }}>
            </div>
            <div>
              <h4 style={{ 
                color: '#6b7280', 
                fontSize: '14px',
                fontWeight: '500',
                margin: '0 0 4px 0'
              }}>
                Nombre de usuario
              </h4>
              <p style={{ 
                color: '#111827', 
                fontSize: '16px',
                fontWeight: '600',
                margin: '0 0 4px 0'
              }}>
                Juan Pérez
              </p>
              <p style={{ 
                color: '#6b7280', 
                fontSize: '14px',
                margin: 0
              }}>
                Correo electrónico
              </p>
              <p style={{ 
                color: '#111827', 
                fontSize: '14px',
                margin: 0
              }}>
                example@email.com
              </p>
            </div>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <h4 style={{ 
              color: '#111827', 
              fontSize: '16px',
              fontWeight: '600',
              margin: '0 0 8px 0'
            }}>
              Estado del evento
            </h4>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '8px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#03ff25ff',
                borderRadius: '50%'
              }}></div>
              <span style={{ 
                color: '#111827', 
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {formData.estadoEvento}
              </span>
            </div>
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
                  Juan Pérez
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
                  123456789
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
                  C.C.
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
                  Cumpleaños Numero 36
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
                  1
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
                  3123213456
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
                  Avenida 68 Num°123, Bogotá D.C.
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
                  15/10/2023
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
                  9:00 AM
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
                  Daviplata
                </div>
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
              Cancelar evento
            </button>

            <button className="btn-primary-custom">
              Editar evento
            </button>

            <button className="btn-primary-custom">
              Editar Estado de Evento
            </button>
          </div>

          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
          }}>
            <button className="btn-secondary-custom" style={{
              padding: '12px 60px',
              fontSize: '16px'
            }}>
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;