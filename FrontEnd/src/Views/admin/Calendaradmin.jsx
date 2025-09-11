import React, { useState } from "react";

const Calendaradmin = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  // Datos ficticios de eventos (puedes conectarlo a backend después)
  const eventos = {
    "2022-02-03": {
      evento: "Reunión importante",
      hora: "10:00 AM",
      lugar: "Sala de juntas",
    },
    "2022-02-07": {
      evento: "Entrega de proyecto",
      hora: "2:00 PM",
      lugar: "Oficina 3",
    },
  };

  const handleDateClick = (day) => {
    setSelectedDate(`2022-02-${day < 10 ? `0${day}` : day}`);
  };

  return (
    <div className="calendar-container">
      {/* Título */}
      <h2 className="calendar-title">Calendario</h2>

      <div className="calendar-content">
        {/* Calendario */}
        <div className="calendar-box">
          <div className="calendar-header">
            <h3>February 2022</h3>
            <div className="calendar-arrows">
              <span>‹</span>
              <span>›</span>
            </div>
          </div>

          <div className="calendar-grid">
            <div className="day-name">Mon</div>
            <div className="day-name">Tue</div>
            <div className="day-name">Wed</div>
            <div className="day-name">Thu</div>
            <div className="day-name">Fri</div>
            <div className="day-name">Sat</div>
            <div className="day-name">Sun</div>

            {[
              "", "", "", "", "", "", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
              14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
            ].map((day, index) => (
              <div
                key={index}
                className={`day ${selectedDate === `2022-02-${day < 10 ? `0${day}` : day}` ? "selected" : ""}`}
                onClick={() => day && handleDateClick(day)}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Detalles de eventos */}
        <div className="event-box">
          {selectedDate && eventos[selectedDate] ? (
            <>
              <p>
                <strong>Día {selectedDate.split("-")[2]}</strong> de eventos:
              </p>
              <p>Evento: {eventos[selectedDate].evento}</p>
              <p>Hora: {eventos[selectedDate].hora}</p>
              <p>Lugar: {eventos[selectedDate].lugar}</p>
            </>
          ) : (
            <>
              <p>Selecciona un día</p>
              <p>Día:</p>
              <p>Hora:</p>
              <p>Lugar:</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendaradmin;
