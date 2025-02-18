import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "../../assets/css/ListarVoluntarios.css";
import { confirmarAcao, mostrarErro, mostrarSucesso } from "../../components/SweetAlert";

function ListVoluntarios() {
  const navigate = useNavigate();
  const [voluntarios, setVoluntarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [ordenar, setOrdenar] = useState("nome");
  const [exibir, setExibir] = useState(10);

  useEffect(() => {
    carregarVoluntarios();
  }, []);

  const carregarVoluntarios = async () => {
    const token = localStorage.getItem("authToken");
    if (!token || token === "null") {
      setError("Usuário não autenticado.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/voluntarios", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);

      const data = await res.json();
      setVoluntarios(data);
    } catch (err) {
      setError("Erro ao carregar voluntários.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (e, id) => {
    e.stopPropagation();
    navigate(`/editarvoluntario/${id}`);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const confirmado = await confirmarAcao(
      "Confirmar Exclusão",
      "Deseja realmente excluir este voluntário?"
    );

    if (confirmado) {
      const token = localStorage.getItem("authToken");
      try {
        const response = await fetch(
          `http://localhost:5000/api/voluntarios/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

        setVoluntarios((prev) => prev.filter((item) => item.id !== id));
        mostrarSucesso("Exclusão", "Voluntário excluído com sucesso!");
      } catch (err) {
        mostrarErro("Erro", "Erro ao excluir. Tente novamente.");
      }
    }
  };

  const voluntariosFiltrados = voluntarios
    .filter((item) =>
      item.nome.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => (a[ordenar] > b[ordenar] ? 1 : -1))
    .slice(0, exibir);

  if (loading) return <div className="loading">Carregando voluntários...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="tabela-container">
      <h1>Gerenciamento de Voluntários</h1>

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

        <button className="botao-adicionar" onClick={() => navigate("/cadastrar-voluntario")}>
          Cadastrar Voluntário
        </button>
      </div>

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
          {voluntariosFiltrados.map((item) => (
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

export default ListVoluntarios;
