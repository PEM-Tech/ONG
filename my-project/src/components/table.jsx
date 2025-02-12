"use client";
import React, { useState } from "react";
import ActionButton from "./actionButton";

const TableWithFilters = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCriteria, setFilterCriteria] = useState(null);
  const [isFilterMenuVisible, setIsFilterMenuVisible] = useState(false);
  const itemsPerPage = 15;

  // Função simulada para filtro - chamada para o back quando disponível
  const handleFilter = (criteria) => {
    setFilterCriteria(criteria);
    console.log(`Enviando requisição para filtrar por: ${criteria}`);
    // Aqui entra a lógica para enviar a requisição ao backend
    setIsFilterMenuVisible(false); // Fecha o menu ao selecionar
  };

  // Calcula os dados para exibição na página atual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="w-full px-4 md:px-8 lg:px-16">
      {/* Filtro */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="relative">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 flex items-center"
            onClick={() => setIsFilterMenuVisible(!isFilterMenuVisible)}
          >
            <span className="mr-2">Filtrar por</span>
            <span className="text-lg">🔽</span>
          </button>
          {isFilterMenuVisible && (
            <div className="absolute mt-2 bg-white border border-gray-300 rounded shadow-lg z-10">
              <ul className="py-2">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleFilter("paciente")}
                >
                  Paciente
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleFilter("profissional")}
                >
                  Médico
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleFilter("status")}
                >
                  Situação
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Tabela / Cards para Mobile */}
      <div className="md:overflow-x-auto">
        <div className="hidden md:block">
          <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Horário</th>
                <th className="border border-gray-300 p-2">Paciente</th>
                <th className="border border-gray-300 p-2">Profissional</th>
                <th className="border border-gray-300 p-2">Status</th>
                <th className="border border-gray-300 p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-2 whitespace-nowrap">{row.horario}</td>
                  <td className="border border-gray-300 p-2 whitespace-nowrap">{row.paciente}</td>
                  <td className="border border-gray-300 p-2 whitespace-nowrap">{row.profissional}</td>
                  <td className="border border-gray-300 p-2 whitespace-nowrap">{row.status}</td>
                  <td className="border border-gray-300 p-2 flex space-x-2 justify-center">
                    <ActionButton
                      color="bg-green-500"
                      icon="✔️"
                      onClick={() => console.log("Presente clicado")}
                    />
                    <ActionButton
                      color="bg-red-500"
                      icon="❌"
                      onClick={() => console.log("Faltou clicado")}
                    />
                    <ActionButton
                      color="bg-yellow-500"
                      icon="⚠️"
                      withDropdown
                      onClick={(justification) =>
                        console.log(`Justificativa selecionada: ${justification}`)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View as Cards */}
        <div className="block md:hidden">
          {paginatedData.map((row, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-4 mb-4 shadow-md"
            >
              <p className="text-sm font-bold mb-2">Horário: <span className="font-normal">{row.horario}</span></p>
              <p className="text-sm font-bold mb-2">Paciente: <span className="font-normal">{row.paciente}</span></p>
              <p className="text-sm font-bold mb-2">Profissional: <span className="font-normal">{row.profissional}</span></p>
              <p className="text-sm font-bold mb-2">Status: <span className="font-normal">{row.status}</span></p>
              <div className="flex space-x-2 mt-2">
                <ActionButton
                  color="bg-green-500"
                  icon="✔️"
                  onClick={() => console.log("Presente clicado")}
                />
                <ActionButton
                  color="bg-red-500"
                  icon="❌"
                  onClick={() => console.log("Faltou clicado")}
                />
                <ActionButton
                  color="bg-yellow-500"
                  icon="⚠️"
                  withDropdown
                  onClick={(justification) =>
                    console.log(`Justificativa selecionada: ${justification}`)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Paginação */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Anterior
        </button>
        <span className="my-2 md:my-0">
          Página {currentPage} de {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          Próxima
        </button>
      </div>
    </div>
  );
};

export default TableWithFilters;
