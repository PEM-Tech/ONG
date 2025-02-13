import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
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

  const handleEdit = (e, id) => {
    e.stopPropagation();
    navigate(`/editarassistido/${id}`);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const confirmado = await confirmarAcao(
      "Confirmar Exclusão",
      "Deseja realmente excluir este assistido?"
    );

    if (confirmado) {
      const token = localStorage.getItem("authToken");
      try {
        const response = await fetch(
          `http://localhost:5000/api/assistidos/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

        setAssistidos((prev) => prev.filter((item) => item.id !== id));
        mostrarSucesso("Exclusão", "Assistido excluído com sucesso!");
      } catch (err) {
        mostrarErro("Erro", "Erro ao excluir. Tente novamente.");
      }
    }
  };

  // 🔹 Filtrando os assistidos com base na pesquisa e ordenação
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

      {/* 🔹 Filtros */}
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

      {/* 🔹 Tabela */}
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Data de Nascimento</th>
            <th>E-mail</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {assistidosFiltrados.map((item) => (
            <tr key={item.id}>
              <td>{item.nome}</td>
              <td>{item.cpf}</td>
              <td>{item.nascimento}</td>
              <td>{item.email}</td>
              <td>
                <button onClick={(e) => handleEdit(e, item.id)} title="Editar" className="action-btn edit">
                  <FaEdit />
                </button>
                <button onClick={(e) => handleDelete(e, item.id)} title="Excluir" className="action-btn delete">
                  <FaTrashAlt />
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
