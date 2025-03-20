import React, { useEffect, useState } from "react";
import "../../assets/css/audit.css";
import { useNavigate } from "react-router-dom";

const AuditTable = () => {
  const navigate = useNavigate();
  const [auditData, setAuditData] = useState([]); // 🔹 Armazena todos os registros
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10; // 🔹 Quantos registros por página

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/audits"); // 🔹 Busca TODOS os registros
        const data = await response.json();
        console.log("🔍 Dados recebidos:", data);
        setAuditData(data); // ✅ Agora os dados são armazenados no estado
      } catch (error) {
        console.error("❌ Erro ao buscar os dados da auditoria:", error);
      }
    };

    fetchData();
  }, []);

  // 🔹 Cálculo dos registros para exibir na página atual
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = auditData.slice(indexOfFirstRecord, indexOfLastRecord);

  // 🔹 Calcular o total de páginas
  const totalPages = Math.ceil(auditData.length / recordsPerPage);

  // 🔹 Funções de navegação
  const goToFirstPage = () => setCurrentPage(1);
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToLastPage = () => setCurrentPage(totalPages);

  return (
    <div className="container">
      <div className="title-audit">
      <button className="back-button-tipoconsulta" onClick={() => navigate(-1)}>⬅ Voltar</button>    
      <h2>Registro de Auditoria</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>Usuário</th>
            <th>Tipo</th>
            <th>Mensagem</th>
            <th>Data e Hora</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.length > 0 ? (
            currentRecords.map((item, index) => (
              <tr key={index}>
                <td>{item.usuario}</td>
                <td>{item.tipo}</td>
                <td>{item.mensagem}</td>
                <td>{item.data_hora ? new Date(item.data_hora).toLocaleString() : "Sem data"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Nenhum registro encontrado</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Controles de Paginação */}
      <div className="pagination">
        <button onClick={goToFirstPage} disabled={currentPage === 1}>
          ⏮ Primeira
        </button>
        <button onClick={prevPage} disabled={currentPage === 1}>
          ⬅ Anterior
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Próxima ➡
        </button>
        <button onClick={goToLastPage} disabled={currentPage === totalPages}>
          Última ⏭
        </button>
      </div>
    </div>
  );
};

export default AuditTable;
