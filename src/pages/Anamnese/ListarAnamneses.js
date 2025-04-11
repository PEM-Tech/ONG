import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../assets/css/listarAssistidos.css";

const AnamneseList = () => {
  const [anamneses, setAnamneses] = useState([]);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnamneses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/anamnese", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setAnamneses(data);
      } catch (error) {
        console.error("Erro ao buscar anamneses:", error);
      }
    };

    fetchAnamneses();
  }, [token]);

  return (
    <div className="cadastro-container">
      <div className="title-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ⬅ Voltar
        </button>
        <h1>Gerenciamento de Anamneses</h1>
      </div>

      <div className="tabela-container">
        <table className="tabela">
          <thead>
            <tr>
              <th>Ficha</th>
              <th>Nome</th>
              <th>Idade</th>
              <th>Data de Nascimento</th>
              <th>Responsavel</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {anamneses.length === 0 ? (
              <tr>
                <td colSpan="6">Nenhuma anamnese encontrada.</td>
              </tr>
            ) : (
              anamneses.map((anamnese) => (
                <tr key={anamnese.id}>
                  <td>{anamnese.assistido_id}</td>
                  <td>{anamnese.nome}</td>
                  <td>{anamnese.idade}</td>
                  <td>{new Date(anamnese.nascimento).toLocaleDateString()}</td>
                  <td>{anamnese.responsavel1}</td>
                  <td>
                    <button
                      onClick={() => navigate(`/visualizaranamnese/${anamnese.id}`)}
                      title="Visualizar"
                    >
                      🔍
                    </button>
                    <button
                      onClick={() => navigate(`/editaanamnese/${anamnese.id}`)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => alert("Em breve: deletar")}
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnamneseList;
