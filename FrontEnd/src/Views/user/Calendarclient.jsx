import React, { useState, useEffect } from "react";
import HeaderAdm from "../../components/HeaderSidebar/HeaderAdm"; // temporal
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
  const [eventos, setEventos] = useState({});
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/events");
        if (!res.ok) throw new Error("Error al obtener eventos");
        const data = await res.json();

        const eventosPorFecha = {};
        data.forEach(evento => {
          const fecha = new Date(evento.EventDateTime).toISOString().split("T")[0];
          if (!eventosPorFecha[fecha]) eventosPorFecha[fecha] = [];
          eventosPorFecha[fecha].push(evento);
        });

        setEventos(eventosPorFecha);
      } catch (error) {
        console.error("Error:", error);
        addToast("Error al cargar los eventos", "error");
      }
    };

    fetchEventos();
  }, [addToast]);

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const generateYears = () => Array.from({ length: 36 }, (_, i) => 2000 + i);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

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

  const getColorByStatus = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'linear-gradient(135deg, #ff4d4d, #ff7a7a)';
      case 'in_planning': return 'linear-gradient(135deg, #4CAF50, #81C784)';
      case 'in_execution': return 'linear-gradient(135deg, #FFA500, #FFC107)';
      default: return 'linear-gradient(135deg, #a5a5a5, #cccccc)';
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
      const hasEvents = eventosDelDia.length > 0;

      const background = hasEvents ? getColorByStatus(eventosDelDia[0].EventStatus) : "";
      const esHoy = new Date().toDateString() === new Date(selectedYear, selectedMonth, day).toDateString();

      calendarCells.push(
        <div
          key={formattedDate}
          className={`day ${isSelected ? "selected" : ""} ${esHoy ? "today" : ""}`}
          onClick={() => handleDayClick(day)}
          style={{
            padding: "20px 10px",
            fontSize: "1.1rem",
            borderRadius: "12px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            background: hasEvents ? background : "var(--color-light)",
            color: hasEvents ? "white" : "var(--color-dark)",
            boxShadow: isSelected ? "0 0 10px var(--color-primary)" : "0 2px 5px rgba(0,0,0,0.1)",
            transform: isSelected ? "scale(1.05)" : "scale(1)",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.08)")}
          onMouseLeave={(e) => (e.target.style.transform = isSelected ? "scale(1.05)" : "scale(1)")}
        >
          {day}
          {hasEvents && (
            <div style={{ fontSize: "1.8rem", marginTop: "5px" }}>•</div>
          )}
        </div>
      );
    }

    return calendarCells;
  };

  return (
    <>
      <HeaderAdm />
      <div className="calendar-container" style={{ padding: "40px" }}>
        <h2
          className="calendar-title"
          style={{
            fontSize: "2.5rem",
            textAlign: "center",
            color: "var(--color-dark)",
            marginBottom: "30px",
            fontWeight: "700",
            background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          <br></br><br></br>
          Calendario de Eventos (Cliente)
        </h2>

        <div className="calendar-content" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "40px" }}>
          {/* Calendario */}
          <div
            className="calendar-box"
            style={{
              background: "var(--color-white)",
              borderRadius: "16px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
              padding: "30px",
              minWidth: "600px",
              maxWidth: "650px",
            }}
          >
            <div className="calendar-header" style={{ display: "flex", justifyContent: "center", marginBottom: "20px", gap: "10px" }}>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                style={{
                  background: "var(--color-light)",
                  border: "2px solid var(--color-gray)",
                  borderRadius: "8px",
                  padding: "10px",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                }}
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                style={{
                  background: "var(--color-light)",
                  border: "2px solid var(--color-gray)",
                  borderRadius: "8px",
                  padding: "10px",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                }}
              >
                {generateYears().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="calendar-grid" style={{ gap: "8px" }}>
              {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((dayName) => (
                <div key={dayName} className="day-name" style={{ fontWeight: "bold", padding: "10px", fontSize: "1rem" }}>
                  {dayName}
                </div>
              ))}
              {renderCalendarDays()}
            </div>
          </div>

          {/* Detalle de eventos */}
          <div
            className="event-box"
            style={{
              background: "var(--color-white)",
              borderRadius: "16px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
              padding: "30px",
              minWidth: "400px",
              maxWidth: "450px",
            }}
          >
            <h4 style={{ fontSize: "1.4rem", marginBottom: "10px" }}>Detalles del Evento</h4>
            {selectedDate && eventos[selectedDate]?.length > 0 ? (
              <>
                <p><strong>Fecha:</strong> {selectedDate}</p>
                {eventos[selectedDate].map((ev, idx) => (
                  <div key={idx} style={{ padding: "10px 0", borderBottom: "1px solid var(--color-light)" }}>
                    <p><strong>Evento:</strong> {ev.EventName}</p>
                    <p><strong>Hora:</strong> {new Date(ev.EventDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                    <p><strong>Cliente:</strong> {ev.ClientName || "Desconocido"}</p>
                    <p><strong>Estado:</strong> {ev.EventStatus}</p>
                  </div>
                ))}
              </>
            ) : selectedDate ? (
              <>
                <p><strong>Fecha:</strong> {selectedDate}</p>
                <p>No hay eventos registrados.</p>
              </>
            ) : (
              <p>Selecciona un día</p>
            )}
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
};

export default Calendarclient;
