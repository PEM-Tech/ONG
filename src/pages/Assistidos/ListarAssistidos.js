import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaFileAlt,  FaSearch   } from "react-icons/fa";
import "../../assets/css/listarAssistidos.css";
import { confirmarAcao, mostrarErro, mostrarSucesso } from "../../components/SweetAlert";

function ListAssistidos() {
  const navigate = useNavigate();
  const [assistidos, setAssistidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(""); // Campo de pesquisa
  const [ordenar, setOrdenar] = useState("nome"); // Critério de ordenação
  const [exibir, setExibir] = useState(10); // Número de assistidos por página

  useEffect(() => {
    carregarAssistidos();
  }, []);

  const carregarAssistidos = async () => {
    const token = localStorage.getItem("authToken");
    if (!token || token === "null") {
      setError("Usuário não autenticado.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/assistidos", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);

      const data = await res.json();
      setAssistidos(data);
    } catch (err) {
      setError("Erro ao carregar assistidos.");
    } finally {
      setLoading(false);
    }
  };

  const handleanamnese = (e, ficha) => {
    e.stopPropagation();
    // Navega para /anamnese/<valor-da-ficha>
    navigate(`/anamnese/${ficha}`);
  };

  const handleVisualizar = (e, ficha) => {
    e.stopPropagation();

  }
 
  const handleEdit = (e, ficha) => {
    e.stopPropagation();
    navigate(`/editarassistido/${ficha}`);
  };

  const handleDelete = async (e, ficha) => {
    e.stopPropagation();
    const confirmado = await confirmarAcao(
      "Confirmar Exclusão",
      "Deseja realmente excluir este assistido?"
    );

    if (confirmado) {
      const token = localStorage.getItem("authToken");
      try {
        const response = await fetch(
          `http://localhost:5000/api/assistidos/${ficha}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

        setAssistidos((prev) => prev.filter((item) => item.ficha !== ficha));
        mostrarSucesso("Exclusão", "Assistido excluído com sucesso!");
      } catch (err) {
        mostrarErro("Erro", "Erro ao excluir. Tente novamente.");
      }
    }
  };


//funcao para formatar o cpf
const formatarCPF = (cpf) => {
  if (!cpf) return "";
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
};
  
    //  Função para formatar a data de nascimento (YYYY-MM-DD → DD/MM/YYYY)
  const formatarData = (data) => {
    if (!data) return "";
    return new Date(data).toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });
  };

  //  Filtrando os assistidos com base na pesquisa e ordenação
  const assistidosFiltrados = assistidos
    .filter((item) =>
      item.nome.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => (a[ordenar] > b[ordenar] ? 1 : -1))
    .slice(0, exibir);

  if (loading) return <div className="loading">Carregando assistidos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="tabela-container">
      <h1>Gerenciamento de Assistidos</h1>

      {/*  Filtros */}
      <div className="filtros">
        <input
          type="text"
          placeholder="Pesquisar por nome"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={ordenar} onChange={(e) => setOrdenar(e.target.value)}>
          <option value="nome">Ordenar por Nome</option>
          <option value="nascimento">Ordenar por Nascimento</option>
        </select>

        <select value={exibir} onChange={(e) => setExibir(Number(e.target.value))}>
          <option value={5}>Exibir 5</option>
          <option value={10}>Exibir 10</option>
          <option value={20}>Exibir 20</option>
        </select>

        <button className="botao-adicionar" onClick={() => navigate("/cadastrar-assistido")}>
          Cadastrar Assistido
        </button>
      </div>

      {/* Tabela */}
      <table>
        <thead>
          <tr>
            <th>Ficha</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>Data de Nascimento</th>
            <th>E-mail</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {assistidosFiltrados.map((item) => (
            <tr key={item.ficha}>
              <td>{item.ficha}</td>
              <td>{item.nome}</td>
              <td>{formatarCPF(item.cpf)}</td>
              <td>{formatarData(item.nascimento)}</td>
              <td>{item.email}</td>
              <td>
                <button onClick={(e) => handleEdit(e, item.ficha)} title="Editar" className="action-btn edit">
                  <FaEdit />
                </button>
                <button onClick={(e) => handleDelete(e, item.ficha)} title="Excluir" className="action-btn delete">
                  <FaTrashAlt />
                </button>
                <button onClick={(e) => handleanamnese(e, item.ficha) } title="Anamnese" className="action-btn anamnese">
                <FaFileAlt />
                </button>
                <button onClick={(e) => handleVisualizar(e, item.ficha) } title="Visualizar Assistido" className="action-btn Visualizar">
                <FaSearch />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListAssistidos;
