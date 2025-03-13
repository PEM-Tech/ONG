import React, { useEffect, useState } from "react";
import "../../assets/css/audit.css";

const AuditTable = () => {
  const [auditData, setAuditData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/audits"); // 🔹 Verifique a URL correta
        const data = await response.json();
        console.log("🔍 Dados recebidos:", data);
        setAuditData(data); // ✅ Agora os dados são salvos no estado
      } catch (error) {
        console.error("❌ Erro ao buscar os dados da auditoria:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <h2>Registro de Auditoria</h2>
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
          {auditData.length > 0 ? (
            auditData.map((item, index) => (
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
    </div>
  );
};

export default AuditTable;
