"use client";
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/pt-br";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../app/globals.css";

// Configura o localizador com o idioma português
moment.locale("pt-br");
const localizer = momentLocalizer(moment);

const ConsultaCalendario = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "João Silva - Dr. Carlos",
      start: new Date("2025-01-22T08:00:00"),
      end: new Date("2025-01-22T09:00:00"),
      paciente: "João Silva",
      profissional: "Dr. Carlos",
      status: "Confirmado",
    },
    {
      id: 2,
      title: "Maria Oliveira - Dra. Ana",
      start: new Date("2025-01-22T09:00:00"),
      end: new Date("2025-01-22T10:00:00"),
      paciente: "Maria Oliveira",
      profissional: "Dra. Ana",
      status: "Ausente",
    },
    {
      id: 3,
      title: "Pedro Santos - Dr. João",
      start: new Date("2025-01-23T10:00:00"),
      end: new Date("2025-01-23T11:00:00"),
      paciente: "Pedro Santos",
      profissional: "Dr. João",
      status: "Justificado",
    },
  ]);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const messages = {
    date: "Data",
    time: "Hora",
    event: "Evento",
    allDay: "Dia todo",
    week: "Semana",
    work_week: "Semana de trabalho",
    day: "Dia",
    month: "Mês",
    previous: "Anterior",
    next: "Próximo",
    yesterday: "Ontem",
    tomorrow: "Amanhã",
    today: "Hoje",
    agenda: "Agenda",
    noEventsInRange: "Nenhum evento neste período.",
    showMore: (total) => `+ Ver mais (${total})`,
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = "#d9d9d9";
    if (event.status === "Confirmado") backgroundColor = "#22c55e";
    else if (event.status === "Ausente") backgroundColor = "#ef4444";
    else if (event.status === "Justificado") backgroundColor = "#facc15";

    return {
      style: { backgroundColor, color: "#fff", borderRadius: "5px" },
    };
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleStatusChange = (newStatus) => {
    if (selectedEvent) {
      setEvents((prevEvents) =>
        prevEvents.map((evt) =>
          evt.id === selectedEvent.id ? { ...evt, status: newStatus } : evt
        )
      );
      setSelectedEvent(null);
    }
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="flex h-screen">
     
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Consultas do Dia - Calendário</h1>

        {/* Calendário */}
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, marginBottom: "1rem" }}
          eventPropGetter={eventStyleGetter}
          messages={messages}
          onSelectEvent={handleEventClick}
        />

        {/* Modal para detalhes */}
        {selectedEvent && (
          <div className="fixed z-index-1 inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
              <h2 className="text-xl font-bold mb-4">Detalhes da Consulta</h2>
              <p>
                <strong>Paciente:</strong> {selectedEvent.paciente}
              </p>
              <p>
                <strong>Profissional:</strong> {selectedEvent.profissional}
              </p>
              <p>
                <strong>Status:</strong> {selectedEvent.status}
              </p>
              <p>
                <strong>Horário:</strong>{" "}
                {new Date(selectedEvent.start).toLocaleTimeString()}
              </p>
              <div className="flex space-x-4 mt-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={() => handleStatusChange("Confirmado")}
                >
                  Presente
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => handleStatusChange("Ausente")}
                >
                  Faltou
                </button>
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                  onClick={() => handleStatusChange("Justificado")}
                >
                  Justificado
                </button>
              </div>
              <button
                className="mt-4 bg-gray-300 px-4 py-2 rounded"
                onClick={closeModal}
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultaCalendario;
