import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar"; // Componente do sidebar já existente
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa"; // Exemplo de ícones
import "../../assets/css/listarAssistidos.css";
import Swal from "sweetalert2";

function ListAssistidos() {
  const navigate = useNavigate();
  const [assistidos, setAssistidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Buscar os assistidos na API (ajuste a URL conforme sua rota backend)
  useEffect(() => {
    fetch("http://localhost:5000/api/assistidos")
      .then((res) => res.json())
      .then((data) => {
        setAssistidos(data);
        setLoading(false);
      })
      .catch((err) => {
        /**
         * Exibe um alerta de erro.
         * @param {string} titulo - Título da mensagem
         * @param {string} mensagem - Texto da mensagem
         */
         const mostrarErro = (titulo, mensagem) => {
            Swal.fire({
                title: titulo,
                text: mensagem,
                icon: "error",
                confirmButtonText: "OK",
            });
        };
        console.error("Erro ao buscar assistidos:", err);
        mostrarErro();
        setError("Erro ao carregar assistidos.");
        setLoading(false);
      });
  }, []);

  //Navega para a página de edição (ou para a visualização detalhada)
  const handleView = (id) => {
    navigate(`/assistido/${id}`); // Rota para visualização/edição completa do assistido
  };

  // Botão de editar (caso queira separar da visualização)
  const handleEdit = (e, id) => {
    e.stopPropagation(); // Evita que o clique no botão acione a visualização da linha
    navigate(`/editar-assistido/${id}`);
  };

  // Botão de excluir
  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Deseja realmente excluir este assistido?")) {
      fetch(`http://localhost:5000/api/assistidos/${id}`, { method: "DELETE" })
        .then((res) => res.json())
        .then(() => {
          setAssistidos(assistidos.filter((item) => item.id !== id));
        })
        .catch((err) => {
          console.error("Erro ao excluir assistido:", err);
          alert("Erro ao excluir. Tente novamente.");
        });
    }
  };

  if (loading) return <div className="loading">Carregando assistidos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="list-assistidos-container">
      {/* Sidebar reaproveitado */}
      <Sidebar />

      <div className="main-content">
        <h1>Lista de Assistidos</h1>
        <table className="assistidos-table">
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
            {assistidos.map((item) => (
              <tr key={item.id} onClick={() => handleView(item.id)}>
                <td>{item.nome}</td>
                <td>{item.cpf}</td>
                <td>{item.nascimento}</td>
                <td>{item.email}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => handleEdit(e, item.id)}
                    title="Editar"
                    className="action-btn edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    title="Excluir"
                    className="action-btn delete"
                  >
                    <FaTrashAlt />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(item.id);
                    }}
                    title="Visualizar"
                    className="action-btn view"
                  >
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Exemplo de botões adicionais ou filtros */}
        <div className="list-controls">
          <button onClick={() => navigate("/cadastrar-assistido")}>
            Cadastrar Novo Assistido
          </button>
          {/* Aqui você pode adicionar controles de busca, filtros ou paginação */}
        </div>
      </div>
    </div>
  );
}

export default ListAssistidos;
