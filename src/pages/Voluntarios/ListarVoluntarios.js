import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaSearch } from "react-icons/fa";
import "../../assets/css/ListarVoluntarios.css";
import { confirmarAcao, mostrarErro, mostrarSucesso } from "../../components/SweetAlert";


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
function ListVoluntarios() {
  const navigate = useNavigate();
  const [voluntarios, setVoluntarios] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [ordenar, setOrdenar] = useState("nome");
  const [exibir, setExibir] = useState(10);
  const recordsPerPage = 10; // 🔹 Quantos registros por página
  
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

    //funcao para formatar o cpf

    try {
      const res = await fetch("http://localhost:5000/api/voluntarios/buscar", {
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
  
  const handleVisualizar = (e, id) => {
    e.stopPropagation();
    navigate(`/visualizarvoluntario/${id}`);
  }

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

// 🔹 Cálculo dos registros para exibir na página atual
const indexOfLastRecord = currentPage * recordsPerPage;
const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
const currentRecords = voluntarios.slice(indexOfFirstRecord, indexOfLastRecord);

// 🔹 Calcular o total de páginas
const totalPages = Math.ceil(voluntarios.length / recordsPerPage);

// 🔹 Funções de navegação
const goToFirstPage = () => setCurrentPage(1);
const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
const goToLastPage = () => setCurrentPage(totalPages);


    
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
              <td>{formatarCPF(item.cpf)}</td>
              <td>{formatarData(item.nascimento)}</td>
              <td>{item.email}</td>
              <td>
                <button onClick={(e) => handleEdit(e, item.id)} title="Editar" className="action-btn edit">
                  <FaEdit />
                </button>
                <button onClick={(e) => handleDelete(e, item.id)} title="Excluir" className="action-btn delete">
                  <FaTrashAlt />
                </button>
                <button onClick={(e) => handleVisualizar(e, item.id) } title="Visualizar Voluntário" className="action-btn Visualizar">
                <FaSearch />
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

export default ListVoluntarios;
