import React, { useState, useEffect, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/pt-br";
import "../../assets/css/agenda.css";
import ModalAdicionarConsulta from "./CadastroConsulta"; // Modal para criar consulta
import ModalEditarConsulta from "./EditarConsulta"; // Novo Modal para editar consulta
import { AuthContext } from "../../context/AuthContext";

moment.locale("pt-br");
const localizer = momentLocalizer(moment);

function AgendaAssistidos() {
  const { token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/agendas", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar dados: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Formato de resposta inválido! Esperado um array.");
        }

        const formattedEvents = data.map((event) => ({
          id: event.id,
          title: `${event.ficha_assistido} - ${event.tipo_consulta}`,
          start: new Date(event.data_hora),
          end: new Date(new Date(event.data_hora).getTime() + 60 * 60 * 1000), // +1 hora
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error("❌ Erro ao buscar consultas:", error.message);
      }
    };

    fetchEvents();
  }, [token]);

  // 📌 Abrir modal de edição ao clicar em um evento
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowEditModal(true);
  };

  return (
    <div className="agenda-container">
      <h1 style={{ textAlign: "center", color: "#007bff" }}>Agenda de Consultas</h1>

      {/* Botão para abrir o modal de adicionar consulta */}
      <button className="add-button" onClick={() => setShowAddModal(true)}>
        Adicionar Consulta
      </button>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        style={{ height: 600, margin: "20px" }}
        onSelectEvent={handleSelectEvent} // 📌 Abrir modal ao clicar em um evento
      />

      {/* Modal para adicionar nova consulta */}
      {showAddModal && <ModalAdicionarConsulta onClose={() => setShowAddModal(false)} />}

      {/* Modal para editar consulta */}
      {showEditModal && selectedEvent && (
        <ModalEditarConsulta
          event={selectedEvent}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}

export default AgendaAssistidos;
