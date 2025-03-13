import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/pt-br";
import "../../assets/css/agenda.css";

moment.locale("pt-br");
const localizer = momentLocalizer(moment);

function AgendaAssistidos() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: new Date(),
    end: new Date(),
  });

  useEffect(() => {
    // Simulação de consultas já cadastradas (substituir por API real)
    setEvents([
      {
        title: "Pedro Henrique - Consulta",
        start: new Date(2024, 2, 12, 10, 0),
        end: new Date(2024, 2, 12, 11, 0),
      },
      {
        title: "Eduardo - Retorno",
        start: new Date(2024, 2, 13, 14, 0),
        end: new Date(2024, 2, 13, 15, 0),
      },
    ]);
  }, []);

  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({ ...newEvent, start, end });
    setShowModal(true);
  };

  const handleAddEvent = () => {
    setEvents([...events, newEvent]);
    setShowModal(false);
  };

  return (
    <div className="agenda-container">
      <h1 style={{ textAlign: "center", color: "#007bff" }}>Agenda de Consultas</h1>
      <button className="add-button" onClick={() => setShowModal(true)}>
        Adicionar Consulta
      </button>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        style={{ height: 600, margin: "20px" }}
        onSelectSlot={handleSelectSlot}
      />
      
      {showModal && (
        <div className="modal">
          <h2>Nova Consulta</h2>
          <input
            type="text"
            placeholder="Nome do Paciente"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <button onClick={handleAddEvent}>Salvar</button>
          <button onClick={() => setShowModal(false)}>Cancelar</button>
        </div>
      )}
    </div>
  );
}

export default AgendaAssistidos;
