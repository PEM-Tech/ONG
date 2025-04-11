import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../assets/css/cadastroVoluntarios.css";
import { AuthContext } from "../../context/AuthContext";

function VisualizarVoluntario() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { id } = useParams();

  const [voluntario, setVoluntario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filePreviews, setFilePreviews] = useState({
    anexo_id_url: "",
  });

  useEffect(() => {
    const fetchVoluntario = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/voluntarios/buscar/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const data = await response.json();

        if (!data) throw new Error("Voluntário não encontrado!");
        setVoluntario(data);

        setFilePreviews({
          anexo_id_url: data.anexo_id ? `http://localhost:5000/anexos/${data.anexo_id}` : "",
        });
      } catch (error) {
        console.error("Erro ao buscar voluntário:", error);
        setVoluntario(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVoluntario();
  }, [id, token]);

  if (loading) return <div className="loading">Carregando dados do voluntário...</div>;
  if (!voluntario) return <div className="error">Erro: Voluntário não encontrado.</div>;

  return (
    <div className="cadastro-container">
      <h1>Visualizar Voluntário</h1>
      <button className="back-button" onClick={() => navigate(-1)}>⬅ Voltar</button>

      <fieldset>
        <legend>Informações Pessoais</legend>
        <div className="form-grid">
          <div className="form-group"><strong>Nome Completo:</strong> {voluntario?.nome}</div>
          <div className="form-group"><strong>CPF:</strong> {voluntario?.cpf}</div>
          <div className="form-group"><strong>Data de Nascimento:</strong> {voluntario?.nascimento}</div>
          <div className="form-group"><strong>Gênero:</strong> {voluntario?.genero}</div>
          <div className="form-group"><strong>Celular:</strong> {voluntario?.celular}</div>
          <div className="form-group"><strong>Email:</strong> {voluntario?.email}</div>
          <div className="form-group"><strong>Categoria:</strong> {voluntario?.categoria_nome ?? "Não informado"}</div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Endereço</legend>
        <div className="form-grid">
          <div className="form-group"><strong>CEP:</strong> {voluntario?.cep}</div>
          <div className="form-group"><strong>Rua:</strong> {voluntario?.rua}</div>
          <div className="form-group"><strong>Número:</strong> {voluntario?.numero}</div>
          <div className="form-group"><strong>Bairro:</strong> {voluntario?.bairro}</div>
          <div className="form-group"><strong>Cidade:</strong> {voluntario?.cidade}</div>
          <div className="form-group"><strong>Estado:</strong> {voluntario?.estado}</div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Anexos</legend>
        <div className="form-group">
          <strong>Documento de Identidade:</strong>{" "}
          {filePreviews.anexo_id_url ? (
            <a className="preview-link" href={filePreviews.anexo_id_url} target="_blank" rel="noopener noreferrer">
              📄 Visualizar Documento
            </a>
          ) : "Nenhum arquivo disponível"}
        </div>
      </fieldset>
    </div>
  );
}

export default VisualizarVoluntario;
