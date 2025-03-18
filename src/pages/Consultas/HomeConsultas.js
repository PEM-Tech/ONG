import React, { useState, useEffect, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/pt-br";
import "../../assets/css/agenda.css";
import ModalAdicionarConsulta from "./CadastroConsulta"; // Importando o modal separado
import { AuthContext } from "../../context/AuthContext"; // Importando contexto de autenticação

moment.locale("pt-br");
const localizer = momentLocalizer(moment);

function AgendaAssistidos() {
  const { token } = useContext(AuthContext); // 🔐 Obtendo o token do usuário autenticado
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); // Estado para abrir o modal de adicionar consulta
  const [selectedEvent, setSelectedEvent] = useState(null);

  // 🚀 **Buscar consultas do backend**
  useEffect(() => {
    if (!token) return; // Se não houver token, não faz a requisição

    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/agendas", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 🔥 Adicionando o token de autenticação
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar dados: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Formato de resposta inválido! Esperado um array.");
        }

        // Formatar os dados para o formato do `react-big-calendar`
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
  }, [token]); // 🔹 Dependência do token para evitar chamadas sem autenticação

  // 📌 Abrir modal ao clicar em um evento
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
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

      {/* Modal para visualizar detalhes do evento */}
      {showModal && selectedEvent && (
        <ModalAdicionarConsulta title="Detalhes da Consulta" onClose={() => setShowModal(false)}>
          <p><strong>Paciente:</strong> {selectedEvent.title}</p>
          <p><strong>Data e Hora:</strong> {moment(selectedEvent.start).format("DD/MM/YYYY HH:mm")}</p>
          <p><strong>Término:</strong> {moment(selectedEvent.end).format("DD/MM/YYYY HH:mm")}</p>
        </ModalAdicionarConsulta>
      )}

      {/* Modal para adicionar nova consulta */}
      {showAddModal && (
        <ModalAdicionarConsulta onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}

export default AgendaAssistidos;
