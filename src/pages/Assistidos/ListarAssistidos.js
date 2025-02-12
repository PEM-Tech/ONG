import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar"; // Componente do sidebar já existente
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa"; // Exemplo de ícones
import "../../assets/css/listarAssistidos.css";
import { confirmarAcao, mostrarErro, mostrarSucesso } from "../../components/SweetAlert";


function ListAssistidos() {
  const navigate = useNavigate();
  const [assistidos, setAssistidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar os assistidos na API com o token no header
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token || token === "null") {
      console.error("Token ausente ou inválido");
      setError("Usuário não autenticado.");
      setLoading(false);
      return;
    }
    // Realiza a requisição somente se o token for válido
    fetch("http://localhost:5000/api/assistidos", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erro HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setAssistidos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar assistidos:", err);
        setError("Erro ao carregar assistidos.");
        setLoading(false);
      });
  }, []);
  

  // Navega para a página de visualização/edição completa do assistido
  const handleView = (id) => {
    
    navigate(`/editarassistido/${id}`);
  };

  // Botão de editar (evita que o clique na linha também acione a visualização)
  const handleEdit = (e, id) => {
    e.stopPropagation();
    const token = localStorage.getItem("authToken");
   
    navigate(`/editarassistido/${id}`);
  };

  // Botão de excluir, incluindo o token no header
  const handleDelete = async (e, id) => {
    e.stopPropagation();
  
    // Usa a função de confirmação do SweetAlert
    const confirmado = await confirmarAcao(
      "Confirmar Exclusão",
      "Deseja realmente excluir este assistido?"
    );
    
    if (confirmado) {
      const token = localStorage.getItem("authToken");
      try {
        const response = await fetch(`http://localhost:5000/api/assistidos/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        // Se a exclusão foi realizada com sucesso, atualize a lista
        setAssistidos(assistidos.filter((item) => item.id !== id));
        mostrarSucesso("Exclusão", "Assistido excluído com sucesso!");
      } catch (err) {
        console.error("Erro ao excluir assistido:", err);
        mostrarErro("Erro", "Erro ao excluir. Tente novamente.");
      }
    }
  };
  

  if (loading) return <div className="loading">Carregando assistidos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="list-assistidos-container">
  

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
              
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Botão para cadastrar novo assistido */}
        <div className="list-controls">
          <button onClick={() => navigate("/cadastrar-assistido")}>
            Cadastrar Novo Assistido
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListAssistidos;
