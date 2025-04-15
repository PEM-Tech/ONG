import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaFileAlt, FaEye, FaRegEdit } from "react-icons/fa";
import "../../assets/css/listarAssistidos.css";
import { confirmarAcao, mostrarErro, mostrarSucesso } from "../../components/SweetAlert";
import  capitalizarNome from "../../components/UpperCase";

function ListAssistidos() {
  const navigate = useNavigate();
  const [assistidos, setAssistidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [ordenar, setOrdenar] = useState("nome");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleAnamnese = (e, ficha) => {
    e.stopPropagation();
    navigate(`/anamnese/${ficha}`);
  };

  const handleVisualizar = (e, ficha) => {
    e.stopPropagation();
    navigate(`/visualizarassistido/${ficha}`);
  };

  const handleEdit = (e, ficha) => {
    e.stopPropagation();
    navigate(`/editarassistido/${ficha}`);
  };

  const handleDelete = async (e, ficha) => {
    e.stopPropagation();
    const confirmado = await confirmarAcao("Confirmar Exclusão", "Deseja realmente excluir este assistido?");

    if (confirmado) {
      const token = localStorage.getItem("authToken");
      try {
        const response = await fetch(`http://localhost:5000/api/assistidos/${ficha}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

        setAssistidos((prev) => prev.filter((item) => item.ficha !== ficha));
        mostrarSucesso("Exclusão", "Assistido excluído com sucesso!");
      } catch (err) {
        mostrarErro("Erro", "Erro ao excluir. Tente novamente.");
      }
    }
  };

  // Função para formatar CPF
  const formatarCPF = (cpf) => {
    if (!cpf) return "";
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
  };

  // Função para formatar data
  const formatarData = (data) => {
    if (!data) return "";
    return new Date(data).toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  // Filtrando os assistidos com base na pesquisa e ordenação
  const assistidosFiltrados = assistidos
    .filter((item) => item.nome.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (a[ordenar] > b[ordenar] ? 1 : -1));

  // Cálculo dos registros para exibir na página atual
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = assistidosFiltrados.slice(indexOfFirstRecord, indexOfLastRecord);

  // Calcular o total de páginas
  const totalPages = Math.ceil(assistidosFiltrados.length / recordsPerPage);

  // Funções de navegação
  const goToFirstPage = () => setCurrentPage(1);
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToLastPage = () => setCurrentPage(totalPages);

  if (loading) return <div className="loading">Carregando assistidos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="tabela-container">
      <div className="title-listassistidos">
      <button className="back-button-assistidos" onClick={() => navigate(-1)}>⬅ Voltar</button>
      <h1 className="title-listassistidos"> Gerenciamento de Assistidos</h1>
      </div>
      {/* Filtros */}
      <div className="filtros">
        <input type="text" placeholder="Pesquisar por nome" value={search} onChange={(e) => setSearch(e.target.value)} />

        <select value={ordenar} onChange={(e) => setOrdenar(e.target.value)}>
          <option value="nome">Ordenar por Nome</option>
          <option value="nascimento">Ordenar por Nascimento</option>
        </select>

        <select value={recordsPerPage} onChange={(e) => setRecordsPerPage(Number(e.target.value))}>
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
          {currentRecords.map((item) => (
            <tr key={item.ficha}>
              <td>{item.ficha}</td>
              <td>{capitalizarNome(item.nome)}</td>
              <td>{formatarCPF(item.cpf)}</td>
              <td>{formatarData(item.nascimento)}</td>
              <td>{item.email}</td>
              <td>
              <button onClick={(e) => handleVisualizar(e, item.ficha)} title="Visualizar Ficha do Assistido" className="action-btn view">
                  <FaEye />
                </button>
                <button onClick={(e) => handleAnamnese(e, item.ficha)} title="Cadastrar Anamnese" className="action-btn anamnese">
                  <FaFileAlt />
                </button>
                <button onClick={(e) => handleDelete(e, item.ficha)} title="Excluir Ficha do Assistido" className="action-btn delete">
                  <FaTrashAlt />
                </button>
                <button onClick={(e) => handleEdit(e, item.ficha)} title="Editar Ficha do Assistido" className="action-btn edit">
                  <FaEdit />
                </button>
              </td>
            </tr>
          ))}
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
}

export default ListAssistidos;
