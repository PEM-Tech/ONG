import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../assets/css/cadastroAssistidos.css";
import { AuthContext } from "../../context/AuthContext";

function VisualizarAssistido() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { id } = useParams(); // Obtém o ID do assistido da URL

  const [assistido, setAssistido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filePreviews, setFilePreviews] = useState({
    anexo_id_url: "",
    anexo2_id_url: "",
    anexo3_id_url: "",
  });

  // 🚀 Busca os dados do assistido ao carregar a página
  useEffect(() => {
    const fetchAssistido = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/assistidos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("Dados recebidos do assistido:", data);

        setAssistido(data);
        setFilePreviews({
          anexo_id_url: data.anexo_id ? `http://localhost:5000/anexos/${data.anexo_id}` : "",
          anexo2_id_url: data.anexo2_id ? `http://localhost:5000/anexos/${data.anexo2_id}` : "",
          anexo3_id_url: data.anexo3_id ? `http://localhost:5000/anexos/${data.anexo3_id}` : "",
        });

        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar assistido:", error);
        setLoading(false);
      }
    };

    fetchAssistido();
  }, [id, token]);

  if (loading) {
    return <div className="loading">Carregando dados do assistido...</div>;
  }

  return (
    <div className="cadastro-container">
      <h1>Visualizar Assistido</h1>
      <button className="back-button" onClick={() => navigate(-1)}>⬅ Voltar</button>

      <fieldset>
        <legend>Informações Pessoais</legend>
        <div className="form-grid">
          <div className="form-group"><strong>Ficha (ID):</strong> {assistido.ficha}</div>
          <div className="form-group"><strong>Nome Completo:</strong> {assistido.nome}</div>
          <div className="form-group"><strong>CPF:</strong> {assistido.cpf}</div>
          <div className="form-group"><strong>Data de Nascimento:</strong> {assistido.nascimento}</div>
          <div className="form-group"><strong>Gênero:</strong> {assistido.genero}</div>
          <div className="form-group"><strong>Celular:</strong> {assistido.celular}</div>
          <div className="form-group"><strong>Email:</strong> {assistido.email}</div>
          <div className="form-group"><strong>De Menor:</strong> {assistido.de_menor === "sim" ? "Sim" : "Não"}</div>

          {assistido.de_menor === "sim" && (
            <>
              <div className="form-group"><strong>Assistido Responsável (ID):</strong> {assistido.assistido_id}</div>
              <div className="form-group"><strong>Parentesco:</strong> {assistido.parentesco}</div>
            </>
          )}
        </div>
      </fieldset>

      <fieldset>
        <legend>Endereço</legend>
        <div className="form-grid">
          <div className="form-group"><strong>CEP:</strong> {assistido.cep}</div>
          <div className="form-group"><strong>Rua:</strong> {assistido.rua}</div>
          <div className="form-group"><strong>Número:</strong> {assistido.numero}</div>
          <div className="form-group"><strong>Bairro:</strong> {assistido.bairro}</div>
          <div className="form-group"><strong>Cidade:</strong> {assistido.cidade}</div>
          <div className="form-group"><strong>Estado:</strong> {assistido.estado}</div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Situação Social</legend>
        <div className="form-group"><strong>Recebe cesta básica?</strong> {assistido.cesta_basica === "sim" ? "Sim" : "Não"}</div>
        <div className="form-group"><strong>Data da Consulta com Assistente Social:</strong> {assistido.data_assistente_social}</div>
        <div className="form-group"><strong>Data da Anamnese:</strong> {assistido.anamnese}</div>
      </fieldset>

      <fieldset>
        <legend>Anexos</legend>
        <div className="form-group">
          <strong>Documento de Identidade:</strong> {filePreviews.anexo_id_url ? (
            <a className="preview-link" href={filePreviews.anexo_id_url} target="_blank" rel="noopener noreferrer">📄 Visualizar Documento</a>
          ) : "Nenhum arquivo disponível"}
        </div>
        <div className="form-group">
          <strong>Comprovante de Residência:</strong> {filePreviews.anexo2_id_url ? (
            <a className="preview-link" href={filePreviews.anexo2_id_url} target="_blank" rel="noopener noreferrer">📄 Visualizar Comprovante</a>
          ) : "Nenhum arquivo disponível"}
        </div>
        <div className="form-group">
          <strong>Comprovante de Renda:</strong> {filePreviews.anexo3_id_url ? (
            <a className="preview-link" href={filePreviews.anexo3_id_url} target="_blank" rel="noopener noreferrer">📄 Visualizar Comprovante</a>
          ) : "Nenhum arquivo disponível"}
        </div>
      </fieldset>
    </div>
  );
}

export default VisualizarAssistido;
