import React, { useState, useEffect, useRef } from "react";
import HeaderAdm from "../../components/HeaderSidebar/HeaderAdm";
import { useToast } from "../../hooks/useToast";
import ToastContainer from "../../components/ToastContainer";
import './../CSS/components.css';
import './../CSS/FormsUser.css';
import '../CSS/Calendar.css';

const Calendaradmin = () => {
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventos, setEventos] = useState({});
  const [citas, setCitas] = useState({});
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const [showYearSelector, setShowYearSelector] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const monthRef = useRef(null);
  const yearRef = useRef(null);

  const months = [
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

  // Cargar eventos y citas del backend
  useEffect(() => {
    fetchCalendarData();
  }, [selectedYear, selectedMonth]);

  const fetchCalendarData = async () => {
    try {
      // Calcular rango de fechas del mes
      const startDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-01`;
      const lastDay = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      const endDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${lastDay}`;

      const res = await fetch(
        `http://localhost:4000/api/calendar/admin?startDate=${startDate}&endDate=${endDate}`
      );

      if (!res.ok) throw new Error("Error al obtener calendario");

      const data = await res.json();

      // Separar eventos y citas
      const eventosPorFecha = {};
      const citasPorFecha = {};

      data.forEach(item => {
        const fecha = new Date(item.start).toISOString().split("T")[0];

        if (item.type === 'event') {
          if (!eventosPorFecha[fecha]) {
            eventosPorFecha[fecha] = [];
          }
          eventosPorFecha[fecha].push({
            EventName: item.title,
            EventDateTime: item.start,
            EventStatus: item.status,
            ClientName: item.userName,
            EventDescription: item.description,
            Address: item.location,
            Capacity: item.capacity
          });
        } else if (item.type === 'appointment') {
          if (!citasPorFecha[fecha]) {
            citasPorFecha[fecha] = [];
          }
          citasPorFecha[fecha].push({
            AppointmentName: item.title,
            AppointmentDateTime: item.start,
            AppointmentStatus: item.status,
            ClientName: item.userName,
            Description: item.description,
            UserEmail: item.userEmail,
            UserPhone: item.userPhone
          });
        }
      });

      setEventos(eventosPorFecha);
      setCitas(citasPorFecha);
    } catch (error) {
      console.error("Error:", error);
      addToast("Error al cargar el calendario", "error");
    }
  };

  const generateYears = () => {
    const years = [];
    for (let i = 2020; i <= 2030; i++) {
      years.push(i);
    }
    return years;
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getStartDay = (year, month) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const handleDayClick = (day) => {
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = selectedMonth + 1 < 10 ? `0${selectedMonth + 1}` : selectedMonth + 1;
    const formattedDate = `${selectedYear}-${formattedMonth}-${formattedDay}`;
    setSelectedDate(formattedDate);
  };

  const changeMonth = (increment) => {
    let nuevoMes = selectedMonth + increment;
    let nuevoAño = selectedYear;
    
    if (nuevoMes > 11) {
      nuevoMes = 0;
      nuevoAño++;
    } else if (nuevoMes < 0) {
      nuevoMes = 11;
      nuevoAño--;
    }
    
    setSelectedMonth(nuevoMes);
    setSelectedYear(nuevoAño);
    setSelectedDate(null);
  };

  const selectMonth = (mes) => {
    setSelectedMonth(mes);
    setShowMonthSelector(false);
    setSelectedDate(null);
  };

  const selectYear = (año) => {
    setSelectedYear(año);
    setShowYearSelector(false);
    setSelectedDate(null);
  };

  const goToCurrentMonth = () => {
    const now = new Date();
    setSelectedMonth(now.getMonth());
    setSelectedYear(now.getFullYear());
    setSelectedDate(null);
  };

  const getColorByStatus = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return '#28a745';
      case 'in_planning':
        return '#ffc107';
      case 'in_execution':
        return '#007bff';
      case 'canceled':
      case 'cancelled':
        return '#dc3545';
      case 'approved':
        return '#17a2b8';
      default:
        return '#6c757d';
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const startDay = getStartDay(selectedYear, selectedMonth);
    const calendarCells = [];

    for (let i = 0; i < startDay; i++) {
      calendarCells.push(<div key={`empty-${i}`} className="day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const formattedDay = day < 10 ? `0${day}` : day;
      const formattedMonth = selectedMonth + 1 < 10 ? `0${selectedMonth + 1}` : selectedMonth + 1;
      const formattedDate = `${selectedYear}-${formattedMonth}-${formattedDay}`;

      const isSelected = selectedDate === formattedDate;
      const eventosDelDia = eventos[formattedDate] || [];
      const citasDelDia = citas[formattedDate] || [];
      const hasEvents = eventosDelDia.length > 0 || citasDelDia.length > 0;
      const esHoy = new Date().toDateString() === new Date(selectedYear, selectedMonth, day).toDateString();

      calendarCells.push(
        <div
          key={formattedDate}
          className={`day ${esHoy ? 'today' : ''} ${isSelected ? "selected" : ""} ${hasEvents ? "event-day" : ""}`}
          onClick={() => handleDayClick(day)}
        >
          <span className="day-number">{day}</span>
          {hasEvents && <span className="event-indicator">•</span>}
        </div>
      );
    }

    return calendarCells;
  };

  return (
    <>
      <HeaderAdm />
      <div className="calendar-container" style={{ marginTop: "80px" }}>
        <h2 className="calendar-title">CALENDARIO</h2>

        <div className="calendar-content">
          {/* Calendario */}
          <div className="calendar-box">
            <div className="calendar-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button className="calendar-arrow" onClick={() => changeMonth(-1)} title="Mes anterior">‹</button>
                
                {/* Selector de Mes */}
                <div ref={monthRef} style={{ position: 'relative' }}>
                  <button 
                    onClick={() => {
                      setShowMonthSelector(!showMonthSelector);
                      setShowYearSelector(false);
                    }}
                    style={{
                      background: 'var(--color-light)',
                      border: '2px solid var(--color-gray)',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      minWidth: '140px',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>{months[selectedMonth]}</span>
                    <span style={{ fontSize: '0.8rem', marginLeft: '8px' }}>▼</span>
                  </button>
                  
                  {showMonthSelector && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      background: 'var(--color-white)',
                      border: '2px solid var(--color-primary)',
                      borderRadius: '8px',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      zIndex: 1000,
                      width: '140px',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      marginTop: '5px'
                    }}>
                      {months.map((mes, index) => (
                        <div
                          key={mes}
                          onClick={() => selectMonth(index)}
                          style={{
                            padding: '10px 12px',
                            cursor: 'pointer',
                            borderBottom: '1px solid var(--color-light)',
                            background: selectedMonth === index ? 'var(--color-primary)' : 'transparent',
                            color: selectedMonth === index ? 'var(--color-white)' : 'var(--color-dark)',
                            transition: 'all 0.2s ease',
                            fontWeight: selectedMonth === index ? 'bold' : 'normal',
                            fontSize: '0.9rem'
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
                    style={{
                      background: 'var(--color-light)',
                      border: '2px solid var(--color-gray)',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      minWidth: '100px',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>{selectedYear}</span>
                    <span style={{ fontSize: '0.8rem', marginLeft: '8px' }}>▼</span>
                  </button>
                  
                  {showYearSelector && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      background: 'var(--color-white)',
                      border: '2px solid var(--color-secondary)',
                      borderRadius: '8px',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      zIndex: 1000,
                      width: '100px',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      marginTop: '5px'
                    }}>
                      {generateYears().map(año => (
                        <div
                          key={año}
                          onClick={() => selectYear(año)}
                          style={{
                            padding: '10px 12px',
                            cursor: 'pointer',
                            borderBottom: '1px solid var(--color-light)',
                            background: selectedYear === año ? 'var(--color-secondary)' : 'transparent',
                            color: selectedYear === año ? 'var(--color-white)' : 'var(--color-dark)',
                            transition: 'all 0.2s ease',
                            fontWeight: selectedYear === año ? 'bold' : 'normal',
                            textAlign: 'center',
                            fontSize: '0.9rem'
                          }}
                        >
                          {año}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button className="calendar-arrow" onClick={() => changeMonth(1)} title="Mes siguiente">›</button>

                <button 
                  onClick={goToCurrentMonth}
                  style={{
                    background: 'var(--color-success)',
                    color: 'var(--color-white)',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    marginLeft: '10px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Hoy
                </button>
              </div>
            </div>

            <div className="calendar-grid">
              {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((dayName, index) => (
                <div key={index} className="day-name">{dayName}</div>
              ))}
              {renderCalendarDays()}
            </div>
          </div>

          {/* Contenedor de detalles */}
          <div style={{ display: 'flex', gap: '20px' }}>
            {/* Detalle de eventos */}
            <div className="event-box" style={{ width: '280px' }}>
              <div className="event-header">
                <h4>Detalles del Evento</h4>
                {selectedDate && (
                  <div className="event-date">
                    {selectedDate.split("-")[2]} de {months[selectedMonth]} de {selectedYear}
                  </div>
                )}
              </div>

              <div className="event-details">
                {selectedDate && eventos[selectedDate]?.length > 0 ? (
                  eventos[selectedDate].map((ev, idx) => (
                    <div key={idx} className="event-item">
                      <div className="detail-item">
                        <strong>Evento:</strong>
                        <span>{ev.EventName}</span>
                      </div>
                      <div className="detail-item">
                        <strong>Hora:</strong>
                        <span>{new Date(ev.EventDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="detail-item">
                        <strong>Cliente:</strong>
                        <span>{ev.ClientName || "Desconocido"}</span>
                      </div>
                      <div className="detail-item">
                        <strong>Estado:</strong>
                        <span style={{ color: getColorByStatus(ev.EventStatus), fontWeight: 'bold' }}>
                          {ev.EventStatus}
                        </span>
                      </div>
                      {idx < eventos[selectedDate].length - 1 && <hr style={{ margin: '10px 0', border: '1px solid var(--color-light)' }} />}
                    </div>
                  ))
                ) : selectedDate ? (
                  <div className="no-selection">
                    <p>No hay eventos registrados para esta fecha.</p>
                  </div>
                ) : (
                  <div className="no-selection">
                    <p>Selecciona un día</p>
                    <div className="detail-item"><strong>Evento:</strong><span>-</span></div>
                    <div className="detail-item"><strong>Hora:</strong><span>-</span></div>
                    <div className="detail-item"><strong>Cliente:</strong><span>-</span></div>
                    <div className="detail-item"><strong>Estado:</strong><span>-</span></div>
                  </div>
                )}
              </div>
            </div>

            {/* Detalles de Cita */}
            <div className="event-box" style={{ width: '280px', borderTop: '4px solid var(--color-accent)' }}>
              <div className="event-header">
                <h4>Detalles de Cita</h4>
              </div>

              <div className="event-details">
                {selectedDate && citas[selectedDate]?.length > 0 ? (
                  citas[selectedDate].map((cita, idx) => (
                    <div key={idx} className="event-item">
                      <div className="detail-item">
                        <strong>Descripción:</strong>
                        <span>{cita.Description || "Sin descripción"}</span>
                      </div>
                      <div className="detail-item">
                        <strong>Hora:</strong>
                        <span>{new Date(cita.AppointmentDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="detail-item">
                        <strong>Cliente:</strong>
                        <span>{cita.ClientName || "Desconocido"}</span>
                      </div>
                      <div className="detail-item">
                        <strong>Contacto:</strong>
                        <span>{cita.UserEmail || cita.UserPhone || "-"}</span>
                      </div>
                      {idx < citas[selectedDate].length - 1 && <hr style={{ margin: '10px 0', border: '1px solid var(--color-light)' }} />}
                    </div>
                  ))
                ) : selectedDate ? (
                  <div className="no-selection">
                    <p>No hay citas registradas para esta fecha.</p>
                  </div>
                ) : (
                  <div className="no-selection">
                    <p>Selecciona un día</p>
                    <div className="detail-item"><strong>Descripción:</strong><span>-</span></div>
                    <div className="detail-item"><strong>Hora:</strong><span>-</span></div>
                    <div className="detail-item"><strong>Cliente:</strong><span>-</span></div>
                    <div className="detail-item"><strong>Contacto:</strong><span>-</span></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
};

export default Calendaradmin;