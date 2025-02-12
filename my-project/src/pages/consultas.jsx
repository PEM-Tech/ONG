"use client";
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import CustomCalendar from "../components/ConsultaCalendario";

const ConsultaCalendario = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const agendamentos = [
    {
      id: "1",
      title: "João Silva - Dr. Carlos",
      start: "2025-01-22T08:00:00",
      end: "2025-01-22T09:00:00",
      paciente: "João Silva",
      profissional: "Dr. Carlos",
      status: "Confirmado",
    },
    {
      id: "2",
      title: "Maria Oliveira - Dra. Ana",
      start: "2025-01-22T09:00:00",
      end: "2025-01-22T10:00:00",
      paciente: "Maria Oliveira",
      profissional: "Dra. Ana",
      status: "Ausente",
    },
    {
      id: "3",
      title: "Pedro Santos - Dr. João",
      start: "2025-01-22T10:00:00",
      end: "2025-01-22T11:00:00",
      paciente: "Pedro Santos",
      profissional: "Dr. João",
      status: "Justificado",
    },
  ];

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Consultas do Dia - Calendário</h1>

        {/* Calendário com eventos */}
        <CustomCalendar events={agendamentos} onEventClick={handleEventClick} />

        {/* Modal para detalhes */}
        {selectedEvent && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
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
                <strong>Horário:</strong> {new Date(selectedEvent.start).toLocaleTimeString()}
              </p>
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
