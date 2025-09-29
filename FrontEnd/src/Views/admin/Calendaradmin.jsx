import React, { useState, useEffect } from "react";
import HeaderAdm from "../../components/HeaderSidebar/HeaderAdm";
import './../CSS/components.css';
import './../CSS/FormsUser.css';
import '../CSS/Calendar.css';

const Calendaradmin = () => {
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventos, setEventos] = useState({});

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/events");
        if (!res.ok) throw new Error("Error al obtener eventos");
        const data = await res.json();

        const eventosPorFecha = {};

        data.forEach(evento => {
          const fecha = new Date(evento.EventDateTime).toISOString().split("T")[0]; // YYYY-MM-DD
          if (!eventosPorFecha[fecha]) {
            eventosPorFecha[fecha] = [];
          }
          eventosPorFecha[fecha].push(evento);
        });

        setEventos(eventosPorFecha);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchEventos();
  }, []);

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const generateYears = () => {
    const years = [];
    for (let i = 2000; i <= 2035; i++) {
      years.push(i);
    }
    return years;
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getStartDay = (year, month) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Lunes = 0
  };

  const handleDayClick = (day) => {
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = selectedMonth + 1 < 10 ? `0${selectedMonth + 1}` : selectedMonth + 1;
    const formattedDate = `${selectedYear}-${formattedMonth}-${formattedDay}`;
    setSelectedDate(formattedDate);
  };

  const getColorByStatus = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return '#ff4d4d';
      case 'in_planning':
        return '#4CAF50';
      case 'in_execution':
        return '#FFA500';
      default:
        return '#a5a5a5';
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

      // Usar el color del primer evento si hay
      const backgroundColor = hasEvents
        ? getColorByStatus(eventosDelDia[0].EventStatus)
        : "";

      calendarCells.push(
        <div
          key={formattedDate}
          className={`day ${isSelected ? "selected" : ""}`}
          onClick={() => handleDayClick(day)}
          style={hasEvents ? { backgroundColor, color: "#fff", borderRadius: "50%" } : {}}
        >
          {day}
        </div>
      );
    }

    return calendarCells;
  };

  return (
    <>
      <HeaderAdm />
      <div className="login-container d-flex justify-content-center" style={{ marginTop: "80px", padding: "20px" }}>
        <div className="form-container-custom">
          <h1 className="login-title">CALENDARIO DE EVENTOS</h1>

          <div className="calendar-content d-flex gap-5 flex-wrap justify-content-center mt-4">
            {/* Calendario */}
            <div className="calendar-box">
              <div className="calendar-header d-flex justify-content-between align-items-center mb-3">
                <div>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="form-select d-inline-block w-auto me-2"
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
                    className="form-select d-inline-block w-auto"
                  >
                    {generateYears().map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="calendar-grid">
                {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((dayName, index) => (
                  <div key={index} className="day-name">
                    {dayName}
                  </div>
                ))}
                {renderCalendarDays()}
              </div>
            </div>

            {/* Detalle de eventos */}
            <div className="event-box">
              {selectedDate && eventos[selectedDate]?.length > 0 ? (
                <>
                  <p><strong>Fecha:</strong> {selectedDate}</p>
                  {eventos[selectedDate].map((ev, idx) => (
                    <div key={idx} className="mb-3">
                      <p><strong>Evento:</strong> {ev.EventName}</p>
                      <p><strong>Hora:</strong> {new Date(ev.EventDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
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
      </div>
    </>
  );
};

export default Calendaradmin;