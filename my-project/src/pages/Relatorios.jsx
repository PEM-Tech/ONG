"use client";
import React, { useState, useRef } from "react";
import '../app/globals.css';
import { Pie, Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Sidebar from "../components/Sidebar";
import Card from "../components/card";
import Table from "../components/table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ChartDataLabels);

const Relatorios = () => {
  const [barDataFilter, setBarDataFilter] = useState("Confirmadas");
  const [lineDataFilter, setLineDataFilter] = useState("Dia");
  const [tableFilter, setTableFilter] = useState("Mês");
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const chartRef = useRef(null);

  const barDataOptions = {
    Confirmadas: [30, 45, 20, 25],
    Ausentes: [10, 15, 5, 8],
    Justificadas: [5, 10, 3, 4],
  };

  const barData = {
    labels: ["01/2025", "02/2025", "03/2025", "04/2025"],
    datasets: [
      {
        label: barDataFilter,
        data: barDataOptions[barDataFilter],
        backgroundColor:
          barDataFilter === "Confirmadas"
            ? "#3b82f6"
            : barDataFilter === "Ausentes"
            ? "#ef4444"
            : "#facc15",
      },
    ],
  };

  const lineDataOptions = {
    Dia: {
      labels: ["Seg", "Ter", "Qua", "Qui", "Sex"],
      data: [5, 12, 8, 9, 15],
    },
    Semana: {
      labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
      data: [40, 60, 30, 50],
    },
    Mês: {
      labels: ["Jan", "Fev", "Mar", "Abr"],
      data: [120, 140, 110, 130],
    },
  };

  const lineData = {
    labels: lineDataOptions[lineDataFilter].labels,
    datasets: [
      {
        label: `Consultas por ${lineDataFilter}`,
        data: lineDataOptions[lineDataFilter].data,
        borderColor: "#10b981",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const barOptions = {
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const lineOptions = {
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const summaryDataOptions = {
    Semana: [
      { periodo: "Semana 1", confirmadas: 15, ausentes: 5, justificadas: 2, total: 22 },
      { periodo: "Semana 2", confirmadas: 20, ausentes: 8, justificadas: 3, total: 31 },
    ],
    Mês: [
      { periodo: "01/2025", confirmadas: 30, ausentes: 10, justificadas: 5, total: 45 },
      { periodo: "02/2025", confirmadas: 45, ausentes: 15, justificadas: 10, total: 70 },
      { periodo: "03/2025", confirmadas: 20, ausentes: 5, justificadas: 3, total: 28 },
      { periodo: "04/2025", confirmadas: 25, ausentes: 8, justificadas: 4, total: 37 },
    ],
    Anual: [
      { periodo: "2024", confirmadas: 300, ausentes: 100, justificadas: 50, total: 450 },
      { periodo: "2025", confirmadas: 120, ausentes: 30, justificadas: 10, total: 160 },
    ],
  };

  const summaryData = summaryDataOptions[tableFilter];

  const detailedConsultations = [
    { horario: "08:00", paciente: "João Silva", profissional: "Dr. Carlos", status: "Confirmado" },
    { horario: "09:00", paciente: "Maria Oliveira", profissional: "Dra. Ana", status: "Ausente" },
    { horario: "10:00", paciente: "Pedro Santos", profissional: "Dr. João", status: "Justificado" },
  ];

  const handleFilteredData = (status) => {
    const filtered = detailedConsultations.filter((item) => item.status === status);
    setFilteredData(filtered);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Consultas", 10, 10);
    doc.autoTable({
      head: [["Horário", "Paciente", "Profissional", "Status"]],
      body: (filteredData || detailedConsultations).map((row) => [row.horario, row.paciente, row.profissional, row.status]),
    });
    doc.save("relatorio.pdf");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData || detailedConsultations);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Consultas");
    XLSX.writeFile(workbook, "relatorio.xlsx");
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Relatórios - Resumo Geral</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <Card title="Consultas Totais" value={120} color="bg-blue-500" />
          <Card
            title="Confirmadas"
            value={95}
            color="bg-green-500"
            onClick={() => handleFilteredData("Confirmado")}
          />
          <Card
            title="Ausentes"
            value={15}
            color="bg-red-500"
            onClick={() => handleFilteredData("Ausente")}
          />
          <Card
            title="Justificadas"
            value={10}
            color="bg-yellow-500"
            onClick={() => handleFilteredData("Justificado")}
          />
        </div>

        {filteredData ? (
          <div className="bg-white p-4 rounded shadow-lg mt-10">
            <button
              className="mb-4 p-2 bg-blue-500 text-white rounded"
              onClick={() => setFilteredData(null)}
            >
              Voltar
            </button>
            <Table
              data={filteredData.map(({ horario, paciente, profissional }) => ({
                Horário: horario,
                Paciente: paciente,
                Profissional: profissional,
              }))}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-4 rounded shadow-lg">
              <h2 className="text-xl font-bold mb-4">Distribuição por Status</h2>
              <div className="w-64 mx-auto relative h-64">
                <Pie
                  data={{
                    labels: ["Confirmadas", "Ausentes", "Justificadas"],
                    datasets: [
                      {
                        data: [95, 15, 10],
                        backgroundColor: ["#22c55e", "#ef4444", "#facc15"],
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: { display: true, position: "top" },
                      tooltip: { enabled: true },
                      datalabels: {
                        display: true,
                        color: "#fff",
                        formatter: (value, context) => {
                          const total = context.dataset.data.reduce(
                            (sum, val) => sum + val,
                            0
                          );
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${percentage}%`;
                        },
                        font: { weight: "bold", size: 14 },
                        align: "center",
                        anchor: "center",
                      },
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Consultas por Mês</h2>
                <select
                  className="p-2 border border-gray-300 rounded"
                  value={barDataFilter}
                  onChange={(e) => setBarDataFilter(e.target.value)}
                >
                  <option value="Confirmadas">Confirmadas</option>
                  <option value="Ausentes">Ausentes</option>
                  <option value="Justificadas">Justificadas</option>
                </select>
              </div>
              <div className="relative mx-auto" style={{ width: "80%", height: "300px" }}>
                <Bar data={barData} options={barOptions} />
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow-lg md:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Consultas por Dia da Semana</h2>
                <select
                  className="p-2 border border-gray-300 rounded"
                  value={lineDataFilter}
                  onChange={(e) => setLineDataFilter(e.target.value)}
                >
                  <option value="Dia">Dia</option>
                  <option value="Semana">Semana</option>
                  <option value="Mês">Mês</option>
                </select>
              </div>
              <div className="relative mx-auto" style={{ width: "90%", maxWidth: "600px", height: "300px" }}>
                <Line data={lineData} options={lineOptions} />
              </div>
            </div>
          </div>
        )}

        {/* Tabela Resumida */}
        <div className="bg-white p-4 rounded shadow-lg mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Tabela Resumida</h2>
            <div className="flex space-x-4">
              <select
                className="p-2 border border-gray-300 rounded"
                value={tableFilter}
                onChange={(e) => setTableFilter(e.target.value)}
              >
                <option value="Semana">Semanal</option>
                <option value="Mês">Mensal</option>
                <option value="Anual">Anual</option>
              </select>
              <button
                className="p-2 bg-blue-500 text-white rounded"
                onClick={exportToPDF}
              >
                Exportar PDF
              </button>
              <button
                className="p-2 bg-green-500 text-white rounded"
                onClick={exportToExcel}
              >
                Exportar Excel
              </button>
            </div>
          </div>
          {!selectedPeriod ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">Período</th>
                  <th className="border border-gray-300 p-2">Confirmadas</th>
                  <th className="border border-gray-300 p-2">Ausentes</th>
                  <th className="border border-gray-300 p-2">Justificadas</th>
                  <th className="border border-gray-300 p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {summaryData.map((row, index) => (
                  <tr
                    key={index}
                    onClick={() => setSelectedPeriod(row.periodo)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <td className="border border-gray-300 p-2">{row.periodo}</td>
                    <td className="border border-gray-300 p-2">{row.confirmadas}</td>
                    <td className="border border-gray-300 p-2">{row.ausentes}</td>
                    <td className="border border-gray-300 p-2">{row.justificadas}</td>
                    <td className="border border-gray-300 p-2">{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <>
              <button
                className="mb-4 p-2 bg-blue-500 text-white rounded"
                onClick={() => setSelectedPeriod(null)}
              >
                Voltar
              </button>
              <Table data={detailedConsultations} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
