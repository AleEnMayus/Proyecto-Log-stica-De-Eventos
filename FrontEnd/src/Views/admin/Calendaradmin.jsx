import React, { useState } from "react";
import HeaderAdm from "../../components/HeaderSidebar/HeaderAdm";
import './../CSS/components.css';
import './../CSS/FormsUser.css';
import '../CSS/Calendar.css';

const Calendaradmin = () => {
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);

  const eventos = {
    "2025-09-23": {
      evento: "Reunión con cliente",
      hora: "10:00 AM",
      lugar: "Oficina A",
    },
    "2025-10-05": {
      evento: "Fiesta Anual",
      hora: "7:00 PM",
      lugar: "Salón Principal",
    },
  };

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
    return day === 0 ? 6 : day - 1; // Ajustar para que Lunes sea 0
  };

  const handleDayClick = (day) => {
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = selectedMonth + 1 < 10 ? `0${selectedMonth + 1}` : selectedMonth + 1;
    const formattedDate = `${selectedYear}-${formattedMonth}-${formattedDay}`;
    setSelectedDate(formattedDate);
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

      calendarCells.push(
        <div
          key={formattedDate}
          className={`day ${isSelected ? "selected" : ""}`}
          onClick={() => handleDayClick(day)}
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

            <div className="event-box">
              {selectedDate && eventos[selectedDate] ? (
                <>
                  <p><strong>Fecha:</strong> {selectedDate}</p>
                  <p><strong>Evento:</strong> {eventos[selectedDate].evento}</p>
                  <p><strong>Hora:</strong> {eventos[selectedDate].hora}</p>
                  <p><strong>Lugar:</strong> {eventos[selectedDate].lugar}</p>
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
