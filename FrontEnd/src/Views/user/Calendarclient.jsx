import React, { useState, useEffect, useRef } from "react";
import HeaderCl from "../../components/HeaderSidebar/HeaderCl";
import { useToast } from "../../hooks/useToast";
import ToastContainer from "../../components/ToastContainer";
import './../CSS/components.css';
import './../CSS/FormsUser.css';
import '../CSS/Calendar.css';

const Calendarclient = () => {
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
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

  const WEEK_DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const YEAR_RANGE = { start: 2020, end: 2030 };
  const STATUS_COLORS = { approved: "green", pending: "orange", rejected: "red", default: "gray" };

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cargar citas del usuario
  useEffect(() => {
    fetchCalendarData();
  }, [selectedYear, selectedMonth]);

  const fetchCalendarData = async () => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) return;
      const user = JSON.parse(userString);
      const userId = user.id;

      const startDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-01`;
      const lastDay = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      const endDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${lastDay}`;

      const res = await fetch(
        `http://localhost:4000/api/calendar/user/${userId}?startDate=${startDate}&endDate=${endDate}&type=appointment`
      );

      if (!res.ok) throw new Error("Error al obtener calendario");

      const data = await res.json();

      // Agrupar citas por fecha usando RequestDate
      const citasPorFecha = {};
        data.forEach(item => {
          // Usamos "start" en lugar de RequestDate
          const fecha = item.start ? item.start.split("T")[0] : null;
          if (!fecha) return; // ignorar elementos sin fecha

          if (!citasPorFecha[fecha]) citasPorFecha[fecha] = [];
          citasPorFecha[fecha].push({
            title: item.title || "Sin título",
            start: item.start || "",
            status: item.status || "pending",
            description: item.description || "Sin descripción",
            ClientName: "Tú",
            CitationDetails: item.requestType || "Por definir" // o el campo que quieras mostrar
          });
        });
        
      setCitas(citasPorFecha);
    } catch (error) {
      console.error("Error:", error);
      addToast("Error al cargar el calendario", "error");
    }
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getStartDay = (year, month) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Lunes = 0
  };
  const formatDate = (year, month, day) => {
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month + 1 < 10 ? `0${month + 1}` : month + 1;
    return `${year}-${formattedMonth}-${formattedDay}`;
  };
  const isToday = (year, month, day) => {
    const date = new Date(year, month, day);
    return new Date().toDateString() === date.toDateString();
  };
  const handleDayClick = (day) => setSelectedDate(formatDate(selectedYear, selectedMonth, day));
  const changeMonth = (increment) => {
    let nuevoMes = selectedMonth + increment;
    let nuevoAño = selectedYear;
    if (nuevoMes > 11) { nuevoMes = 0; nuevoAño++; }
    if (nuevoMes < 0) { nuevoMes = 11; nuevoAño--; }
    setSelectedMonth(nuevoMes);
    setSelectedYear(nuevoAño);
    setSelectedDate(null);
  };
  const selectMonth = (mes) => { setSelectedMonth(mes); setShowMonthSelector(false); setSelectedDate(null); };
  const selectYear = (año) => { setSelectedYear(año); setShowYearSelector(false); setSelectedDate(null); };
  const goToCurrentMonth = () => { const now = new Date(); setSelectedMonth(now.getMonth()); setSelectedYear(now.getFullYear()); setSelectedDate(null); };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const startDay = getStartDay(selectedYear, selectedMonth);
    const calendarCells = [];
    for (let i = 0; i < startDay; i++) calendarCells.push(<div key={`empty-${i}`} className="day empty"></div>);
    for (let day = 1; day <= daysInMonth; day++) {
      const formattedDate = formatDate(selectedYear, selectedMonth, day);
      const isSelected = selectedDate === formattedDate;
      const eventosDelDia = citas[formattedDate] || [];
      const hasEvents = eventosDelDia.length > 0;
      const esHoy = isToday(selectedYear, selectedMonth, day);
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

  const renderAppointmentDetails = () => {
    if (!selectedDate) return (<div className="no-selection"><p>Selecciona un día</p></div>);
    const eventosDelDia = citas[selectedDate];
    if (!eventosDelDia || eventosDelDia.length === 0) return (<div className="no-selection"><p>No hay citas registradas para esta fecha.</p></div>);
    return eventosDelDia.map((ev, idx) => (
      <div key={idx} className="event-item">
        <div className="detail-item"><strong>Descripción:</strong><span>{ev.description || "Sin descripción"}</span></div>
        <div className="detail-item"><strong>Hora:</strong><span>{new Date(ev.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
        <div className="detail-item"><strong>Cliente:</strong><span>{ev.ClientName || "Desconocido"}</span></div>
        <div className="detail-item"><strong>Fecha:</strong><span>{selectedDate.split("-")[2]} de {months[selectedMonth]} de {selectedYear}</span></div>
        <div className="detail-item"><strong>Citación:</strong><span>{ev.CitationDetails}</span></div>
        {idx < eventosDelDia.length - 1 && <hr style={{ margin: '10px 0', border: '1px solid var(--color-light)' }} />}
      </div>
    ));
  };

  return (
    <>
      <HeaderCl />
      <div className="calendar-container" style={{ marginTop: "80px" }}>
        <h2 className="calendar-title">CALENDARIO</h2>
        <div className="calendar-content">
          <div className="calendar-box">
            <div className="calendar-header">
              <button className="calendar-arrow" onClick={() => changeMonth(-1)}>‹</button>
              <div ref={monthRef}>
                <button onClick={() => setShowMonthSelector(!showMonthSelector)}>{months[selectedMonth]} ▼</button>
                {showMonthSelector && months.map((mes, i) => <div key={i} onClick={() => selectMonth(i)}>{mes}</div>)}
              </div>
              <div ref={yearRef}>
                <button onClick={() => setShowYearSelector(!showYearSelector)}>{selectedYear} ▼</button>
                {showYearSelector && Array.from({ length: YEAR_RANGE.end - YEAR_RANGE.start + 1 }, (_, i) => YEAR_RANGE.start + i)
                  .map(año => <div key={año} onClick={() => selectYear(año)}>{año}</div>)}
              </div>
              <button className="calendar-arrow" onClick={() => changeMonth(1)}>›</button>
              <button onClick={goToCurrentMonth}>Hoy</button>
            </div>
            <div className="calendar-grid">
              {WEEK_DAYS.map((d, i) => <div key={i} className="day-name">{d}</div>)}
              {renderCalendarDays()}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px', flexDirection: 'row' }}>
            <div className="event-box" style={{ width: '280px' }}>
              <div className="event-header"><h4>Detalles del Evento</h4></div>
              <div className="event-details"><div className="no-selection"><span>-</span></div></div>
            </div>
            <div className="event-box" style={{ width: '280px' }}>
              <div className="event-header"><h4>Detalles de Cita</h4></div>
              <div className="event-details">{renderAppointmentDetails()}</div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
};

export default Calendarclient;