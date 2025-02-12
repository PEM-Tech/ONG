"use client";
import React, { useState, useEffect } from "react";
import Card from "../components/card";
import Sidebar from "../components/Sidebar";
import Table from "../components/table";

function Dashboard() {
  
  // Estados para armazenar os valores dinâmicos
  const [totalConsultas, setTotalConsultas] = useState(null);
  const [confirmadas, setConfirmadas] = useState(null);
  const [ausentes, setAusentes] = useState(null);

  // Simula uma chamada ao servidor para buscar os dados
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/consultas"); // URL fictícia
        const data = await response.json();

        // Atualiza os valores com os dados retornados
        setTotalConsultas(data.totalConsultas);
        setConfirmadas(data.confirmadas);
        setAusentes(data.ausentes);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  // Dados simulados para a tabela
  const tableData = [
    {
      horario: "08:00",
      paciente: "João Silva",
      profissional: "Dr. Carlos",
      status: "Confirmado",
      acoes: ["Presente", "Faltou", "Justificado"],
    },
  ];

  return (
    
    <div className="flex">
             <Sidebar />
      {/* Conteúdo principal */}
      <div className="flex-1 p-6">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Bem-vindo ao Sistema de Presença</h1>
          <p className="text-gray-600">{new Date().toLocaleDateString()}</p>
        </div>

        {/* Resumo em Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  <Card title="Total de Consultas" value={12} color="bg-blue-500" />
  <Card title="Confirmadas" value={8} color="bg-green-500" />
  <Card title="Ausentes" value={4} color="bg-red-500" />
</div>

        {/* Lista de Consultas */}
        <div>
          <h2 className="text-xl font-bold mb-4">Consultas do Dia</h2>
          <Table data={tableData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;