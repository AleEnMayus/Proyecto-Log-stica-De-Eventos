import React, { useState, useEffect, useRef } from "react";
import HeaderCl from "../../components/HeaderSidebar/HeaderCl";
import "../CSS/components.css";

const Calendarclient = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventos, setEventos] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const [showYearSelector, setShowYearSelector] = useState(false);
  
  const monthRef = useRef(null);
  const yearRef = useRef(null);
  
  const userId = 1;
  const baseURL = "http://localhost:4000";

  // Meses en español
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // Cerrar selectores al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (monthRef.current && !monthRef.current.contains(event.target)) {
        setShowMonthSelector(false);
      }
      if (yearRef.current && !yearRef.current.contains(event.target)) {
        setShowYearSelector(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Obtener número de días del mes actual
  const diasMes = new Date(currentYear, currentMonth, 0).getDate();
  
  // Obtener el día de la semana del primer día del mes (0 = Domingo, 1 = Lunes, etc.)
  const primerDiaSemana = new Date(currentYear, currentMonth - 1, 1).getDay();
  // Ajustar para que la semana empiece en Lunes (0 = Lunes, 6 = Domingo)
  const primerDiaAjustado = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;

  // Generar array de días vacíos para alinear el calendario
  const diasVacios = Array.from({ length: primerDiaAjustado }, (_, i) => i);

  // Generar array de años (desde 2020 hasta 2030)
  const años = Array.from({ length: 11 }, (_, i) => 2020 + i);

  // Obtener eventos desde el backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${baseURL}/api/events/user/${userId}`);
        const data = await res.json();

        const eventosPorFecha = {};
        data.forEach((evento) => {
          const fechaISO = evento.EventDateTime.split("T")[0];
          eventosPorFecha[fechaISO] = {
            evento: evento.EventName,
            hora: new Date(evento.EventDateTime).toLocaleTimeString([], { 
              hour: "2-digit", 
              minute: "2-digit" 
            }),
            lugar: evento.EventLocation || "No especificado",
          };
        });

        setEventos(eventosPorFecha);
      } catch (error) {
        console.error("Error cargando eventos:", error);
      }
    };

    fetchEvents();
  }, [userId]);

  // Cuando el usuario selecciona un día
  const handleDateClick = (day) => {
    const fechaFormateada = `${currentYear}-${currentMonth < 10 ? `0${currentMonth}` : currentMonth}-${day < 10 ? `0${day}` : day}`;
    setSelectedDate(fechaFormateada);
  };

  // Cambiar mes
  const changeMonth = (increment) => {
    let nuevoMes = currentMonth + increment;
    let nuevoAño = currentYear;
    
    if (nuevoMes > 12) {
      nuevoMes = 1;
      nuevoAño++;
    } else if (nuevoMes < 1) {
      nuevoMes = 12;
      nuevoAño--;
    }
    
    setCurrentMonth(nuevoMes);
    setCurrentYear(nuevoAño);
    setSelectedDate(null);
  };

  // Seleccionar mes específico
  const selectMonth = (mes) => {
    setCurrentMonth(mes);
    setShowMonthSelector(false);
    setSelectedDate(null);
  };

  // Seleccionar año específico
  const selectYear = (año) => {
    setCurrentYear(año);
    setShowYearSelector(false);
    setSelectedDate(null);
  };

  // Ir al mes actual
  const goToCurrentMonth = () => {
    const now = new Date();
    setCurrentMonth(now.getMonth() + 1);
    setCurrentYear(now.getFullYear());
    setSelectedDate(null);
  };

  return (
    <div className="calendar-container">
      <HeaderCl />
      
      {/* Título "Calendario Cliente" - Más grande y destacado */}
      <h2 className="calendar-title" style={{
        fontSize: '2.5rem',
        textAlign: 'center',
        color: 'var(--color-dark)',
        marginBottom: '30px',
        fontWeight: '700',
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        padding: '10px 0'
      }}>
        Calendario Cliente
      </h2>

      <div className="calendar-content">
        {/* Calendario - Un poco más grande */}
        <div className="calendar-box" style={{
          minWidth: '600px',
          maxWidth: '650px',
          margin: '0 auto',
          padding: '30px'
        }}>
          <div className="calendar-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button 
                className="calendar-arrow" 
                onClick={() => changeMonth(-1)}
                title="Mes anterior"
                style={{
                  width: '45px',
                  height: '45px',
                  fontSize: '1.3rem'
                }}
              >
                ‹
              </button>
              
              {/* Selector de Mes */}
              <div ref={monthRef} style={{ position: 'relative' }}>
                <button 
                  onClick={() => {
                    setShowMonthSelector(!showMonthSelector);
                    setShowYearSelector(false);
                  }}
                  className="month-year-selector"
                  style={{
                    background: 'var(--color-light)',
                    border: '2px solid var(--color-gray)',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    minWidth: '160px',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--color-accent)';
                    e.target.style.color = 'var(--color-white)';
                    e.target.style.borderColor = 'var(--color-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'var(--color-light)';
                    e.target.style.color = 'var(--color-dark)';
                    e.target.style.borderColor = 'var(--color-gray)';
                  }}
                >
                  <span>{meses[currentMonth - 1]}</span>
                  <span style={{ fontSize: '0.9rem', marginLeft: '10px' }}>▼</span>
                </button>
                
                {showMonthSelector && (
                  <div className="selector-dropdown" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    background: 'var(--color-white)',
                    border: '2px solid var(--color-primary)',
                    borderRadius: '8px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    width: '160px',
                    maxHeight: '250px',
                    overflowY: 'auto',
                    marginTop: '5px'
                  }}>
                    {meses.map((mes, index) => (
                      <div
                        key={mes}
                        onClick={() => selectMonth(index + 1)}
                        style={{
                          padding: '12px 15px',
                          cursor: 'pointer',
                          borderBottom: '1px solid var(--color-light)',
                          background: currentMonth === index + 1 
                            ? 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' 
                            : 'transparent',
                          color: currentMonth === index + 1 ? 'var(--color-white)' : 'var(--color-dark)',
                          transition: 'all 0.2s ease',
                          fontWeight: currentMonth === index + 1 ? 'bold' : 'normal',
                          fontSize: '1rem'
                        }}
                        onMouseEnter={(e) => {
                          if (currentMonth !== index + 1) {
                            e.target.style.background = 'var(--color-accent)';
                            e.target.style.color = 'var(--color-white)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (currentMonth !== index + 1) {
                            e.target.style.background = 'transparent';
                            e.target.style.color = 'var(--color-dark)';
                          }
                        }}
                      >
                        {mes}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Selector de Año */}
              <div ref={yearRef} style={{ position: 'relative' }}>
                <button 
                  onClick={() => {
                    setShowYearSelector(!showYearSelector);
                    setShowMonthSelector(false);
                  }}
                  className="month-year-selector"
                  style={{
                    background: 'var(--color-light)',
                    border: '2px solid var(--color-gray)',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    minWidth: '120px',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--color-accent)';
                    e.target.style.color = 'var(--color-white)';
                    e.target.style.borderColor = 'var(--color-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'var(--color-light)';
                    e.target.style.color = 'var(--color-dark)';
                    e.target.style.borderColor = 'var(--color-gray)';
                  }}
                >
                  <span>{currentYear}</span>
                  <span style={{ fontSize: '0.9rem', marginLeft: '10px' }}>▼</span>
                </button>
                
                {showYearSelector && (
                  <div className="selector-dropdown" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    background: 'var(--color-white)',
                    border: '2px solid var(--color-secondary)',
                    borderRadius: '8px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    width: '120px',
                    maxHeight: '250px',
                    overflowY: 'auto',
                    marginTop: '5px'
                  }}>
                    {años.map(año => (
                      <div
                        key={año}
                        onClick={() => selectYear(año)}
                        style={{
                          padding: '12px 15px',
                          cursor: 'pointer',
                          borderBottom: '1px solid var(--color-light)',
                          background: currentYear === año 
                            ? 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' 
                            : 'transparent',
                          color: currentYear === año ? 'var(--color-white)' : 'var(--color-dark)',
                          transition: 'all 0.2s ease',
                          fontWeight: currentYear === año ? 'bold' : 'normal',
                          textAlign: 'center',
                          fontSize: '1rem'
                        }}
                        onMouseEnter={(e) => {
                          if (currentYear !== año) {
                            e.target.style.background = 'var(--color-accent)';
                            e.target.style.color = 'var(--color-white)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (currentYear !== año) {
                            e.target.style.background = 'transparent';
                            e.target.style.color = 'var(--color-dark)';
                          }
                        }}
                      >
                        {año}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button 
                className="calendar-arrow" 
                onClick={() => changeMonth(1)}
                title="Mes siguiente"
                style={{
                  width: '45px',
                  height: '45px',
                  fontSize: '1.3rem'
                }}
              >
                ›
              </button>

              <button 
                onClick={goToCurrentMonth}
                style={{
                  background: 'var(--color-success)',
                  color: 'var(--color-white)',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  marginLeft: '10px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--color-secondary)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'var(--color-success)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                Hoy
              </button>
            </div>
          </div>

          <div className="calendar-grid" style={{
            gap: '8px',
            marginTop: '20px'
          }}>
            <div className="day-name" style={{ padding: '15px 8px', fontSize: '1rem', fontWeight: 'bold' }}>Lun</div>
            <div className="day-name" style={{ padding: '15px 8px', fontSize: '1rem', fontWeight: 'bold' }}>Mar</div>
            <div className="day-name" style={{ padding: '15px 8px', fontSize: '1rem', fontWeight: 'bold' }}>Mié</div>
            <div className="day-name" style={{ padding: '15px 8px', fontSize: '1rem', fontWeight: 'bold' }}>Jue</div>
            <div className="day-name" style={{ padding: '15px 8px', fontSize: '1rem', fontWeight: 'bold' }}>Vie</div>
            <div className="day-name" style={{ padding: '15px 8px', fontSize: '1rem', fontWeight: 'bold' }}>Sáb</div>
            <div className="day-name" style={{ padding: '15px 8px', fontSize: '1rem', fontWeight: 'bold' }}>Dom</div>

            {/* Días vacíos para alinear el calendario */}
            {diasVacios.map((_, index) => (
              <div key={`empty-${index}`} className="day empty"></div>
            ))}

            {/* Días del mes */}
            {Array.from({ length: diasMes }, (_, i) => i + 1).map((day) => {
              const fechaFormateada = `${currentYear}-${currentMonth < 10 ? `0${currentMonth}` : currentMonth}-${day < 10 ? `0${day}` : day}`;
              const tieneEvento = eventos[fechaFormateada];
              const esHoy = new Date().toDateString() === new Date(currentYear, currentMonth - 1, day).toDateString();

              return (
                <div
                  key={day}
                  className={`day ${esHoy ? 'today' : ''} ${
                    selectedDate === fechaFormateada ? "selected" : ""
                  } ${tieneEvento ? "event-day" : ""}`}
                  onClick={() => handleDateClick(day)}
                  style={{
                    padding: '20px 10px',
                    minHeight: '70px',
                    fontSize: '1.1rem'
                  }}
                >
                  <span className="day-number" style={{ fontSize: '1.1rem', fontWeight: '600' }}>{day}</span>
                  {tieneEvento && <span className="event-indicator" style={{ fontSize: '1.8rem', marginTop: '5px' }}>•</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Detalles de eventos - También más grande */}
        <div className="event-box" style={{
          minWidth: '400px',
          maxWidth: '450px',
          margin: '0 auto',
          padding: '30px'
        }}>
          <div className="event-header">
            <h4 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>Detalles del Evento</h4>
            {selectedDate && (
              <div className="event-date" style={{ fontSize: '1rem', color: 'var(--color-secondary)' }}>
                {selectedDate.split("-")[2]} de {meses[currentMonth - 1]} de {currentYear}
              </div>
            )}
          </div>

          <div className="event-details" style={{ marginTop: '20px' }}>
            {selectedDate && eventos[selectedDate] ? (
              <>
                <div className="detail-item" style={{ padding: '12px 0', fontSize: '1.1rem' }}>
                  <strong style={{ fontSize: '1.1rem' }}>Evento:</strong>
                  <span style={{ fontSize: '1.1rem' }}>{eventos[selectedDate].evento}</span>
                </div>
                <div className="detail-item" style={{ padding: '12px 0', fontSize: '1.1rem' }}>
                  <strong style={{ fontSize: '1.1rem' }}>Hora:</strong>
                  <span style={{ fontSize: '1.1rem' }}>{eventos[selectedDate].hora}</span>
                </div>
                <div className="detail-item" style={{ padding: '12px 0', fontSize: '1.1rem' }}>
                  <strong style={{ fontSize: '1.1rem' }}>Lugar:</strong>
                  <span style={{ fontSize: '1.1rem' }}>{eventos[selectedDate].lugar}</span>
                </div>
              </>
            ) : (
              <div className="no-selection">
                <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Selecciona un día</p>
                <div className="detail-item" style={{ padding: '12px 0', fontSize: '1.1rem' }}>
                  <strong style={{ fontSize: '1.1rem' }}>Evento:</strong>
                  <span style={{ fontSize: '1.1rem' }}>-</span>
                </div>
                <div className="detail-item" style={{ padding: '12px 0', fontSize: '1.1rem' }}>
                  <strong style={{ fontSize: '1.1rem' }}>Hora:</strong>
                  <span style={{ fontSize: '1.1rem' }}>-</span>
                </div>
                <div className="detail-item" style={{ padding: '12px 0', fontSize: '1.1rem' }}>
                  <strong style={{ fontSize: '1.1rem' }}>Lugar:</strong>
                  <span style={{ fontSize: '1.1rem' }}>-</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendarclient;