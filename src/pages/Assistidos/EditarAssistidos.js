import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../assets/css/cadastroAssistidos.css";
import { mostrarSucesso, mostrarErro } from "../../components/SweetAlert";
import { AuthContext } from "../../context/AuthContext";
import InputMask from "react-input-mask";

function EditarAssistido() {
  const navigate = useNavigate();

  const { token, user } = useContext(AuthContext);
  const { id } = useParams(); // Obtém o ID do assistido da URL

  const [filePreviews, setFilePreviews] = useState({
    anexo_id_url: "",
    anexo2_id_url: "",
    anexo3_id_url: "",
  });


  const totalSteps = 4;
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    ficha: "",
    nome: "",
    cpf: "",
    nascimento: "",
    genero: "",
    celular: "",
    email: "",
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    complemento: "",
    de_menor: "nao",
    assistido_id: "",
    parentesco: "",
    cesta_basica: "nao",
    data_assistente_social: "",
    anamnese: "",
    anexo_id: null,
    anexo2_id: null,
    anexo3_id: null,
  });

  const [errors, setErrors] = useState({});

  // 🚀 Busca os dados do assistido ao carregar a página
  useEffect(() => {
    const fetchAssistido = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/assistidos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("Dados recebidos do assistido:", data); // 🔍 Verifique se os anexos estão sendo retornados
  
        setFormData({
          ficha: data.ficha || "",
          nome: data.nome || "",
          cpf: data.cpf || "",
          nascimento: data.nascimento ? data.nascimento.split("T")[0] : "",
          genero: data.genero || "",
          celular: data.celular || "",
          email: data.email || "",
          cep: data.cep || "",
          rua: data.rua || "",
          numero: data.numero || "",
          bairro: data.bairro || "",
          cidade: data.cidade || "",
          estado: data.estado || "",
          complemento: data.complemento || "",
          de_menor: data.de_menor || "nao",
          assistido_id: data.assistido_id || "",
          parentesco: data.parentesco || "",
          cesta_basica: data.cesta_basica || "nao",
          data_assistente_social: data.data_assistente_social ? data.data_assistente_social.split("T")[0] : "",
          anamnese: data.anamnese ? data.anamnese.split("T")[0] : "",
          anexo_id: null,
          anexo2_id: null,
          anexo3_id: null,
        });
  
        // Verifique se as URLs dos anexos estão presentes
        setFilePreviews({
          anexo_id_url: data.anexo_id ? `http://localhost:5000/anexos/${data.anexo_id}` : "",
          anexo2_id_url: data.anexo2_id ? `http://localhost:5000/anexos/${data.anexo2_id}` : "",
          anexo3_id_url: data.anexo3_id ? `http://localhost:5000/anexos/${data.anexo3_id}` : "",
        });
        
  
        console.log("URLs dos anexos:", {
          anexo_id_url: data.anexo_id_url,
          anexo2_id_url: data.anexo2_id_url,
          anexo3_id_url: data.anexo3_id_url,
        });
  
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar assistido:", error);
        mostrarErro("Erro", "Não foi possível carregar os dados do assistido.");
        setLoading(false);
      }
    };
  
    fetchAssistido();
  }, [id, token]);
  
  

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      assistido_id: name === "de_menor" && value === "nao" ? "" : prev.assistido_id,
      parentesco: name === "de_menor" && value === "nao" ? "" : prev.parentesco,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const fetchCEP = async () => {
    if (formData.cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${formData.cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            rua: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            estado: data.uf || "",
          }));
        } else {
          setErrors((prev) => ({ ...prev, cep: "CEP não encontrado!" }));
        }
      } catch (error) {
        setErrors((prev) => ({ ...prev, cep: "Erro ao buscar CEP." }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submissionData = new FormData();
      for (const key in formData) {
        submissionData.append(key, formData[key]);
      }

      submissionData.append("executado_por", user.id);

      const response = await fetch(`http://localhost:5000/api/assistidos/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submissionData,
      });

      if (response.ok) {
        mostrarSucesso("Sucesso", "Assistido atualizado com sucesso!");
        setTimeout(() => {
          navigate("/listarassistido");
        }, 1500);
      } else {
        mostrarErro("Erro", "Erro ao atualizar cadastro.");
      }
    } catch (error) {
      mostrarErro("Erro", "Erro ao atualizar cadastro. Tente novamente mais tarde.");
    }
  };

  if (loading) {
    return <div className="loading">Carregando dados do assistido...</div>;
  }

  return (
    <div className="cadastro-container">
      <h1>Editar Assistido</h1>
      <button className="back-button" onClick={() => navigate(-1)}>⬅ Sair</button>
      <form onSubmit={handleSubmit}>
      {currentStep === 1 && (
        <fieldset>
          <legend>Informações Pessoais</legend>
          <div className="form-grid">
          <div className="form-group">
              <label>Ficha (ID)</label>
              <input type="number" name="ficha" value={formData.ficha} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Nome Completo</label>
              <input type="text" name="nome" value={formData.nome} onChange={handleChange} />
            </div>
            <div className="form-group">
               <label>CPF</label>
               <InputMask mask="999.999.999-99" type="text" name="cpf" value={formData.cpf} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Data de Nascimento</label>
              <input type="date" name="nascimento" value={formData.nascimento} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Gênero</label>
              <select name="genero" value={formData.genero} onChange={handleChange}>
                <option value="">Selecione</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
              </select>
            </div>
             <div className="form-group">
               <label>Celular</label>
               <InputMask mask="(99) 99999-9999" type="text" name="celular" value={formData.celular} onChange={handleChange} />
             </div>
             <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
              <div className="form-group">
              <label>De Menor?</label>
              <select name="de_menor" value={formData.de_menor} onChange={handleChange}>
                <option value="nao">Não</option>
                <option value="sim">Sim</option>
              </select>
            </div>
        
               {/* 🔹 Mostrar assistido_id apenas se "de_menor" for "sim" */}
               {formData.de_menor === "sim" && (
              <>
                <div className="form-group">
                  <label>Assistido Responsável (ID)</label>
                  <input type="number" name="assistido_id" value={formData.assistido_id} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Parentesco</label>
                  <input type="text" name="parentesco" value={formData.parentesco} onChange={handleChange} />
                </div>
              </>
            )}
              </div>
        </fieldset>
      )}

        
      {currentStep === 2 && (
        <fieldset>
          <legend>Endereço</legend>
          <div className="form-grid">
            <div className="form-group">
              <label>CEP</label>
               <InputMask mask="99999-999" type="text" name="cep" value={formData.cep} onChange={handleChange} onBlur={fetchCEP} />
               {errors.cep && <span className="error">{errors.cep}</span>}
            </div>
            <div className="form-group">
              <label>Rua</label>
              <input type="text" name="rua" value={formData.rua} readOnly />
            </div>
            <div className="form-group">
              <label>Número</label>
              <input type="text" name="numero" value={formData.numero} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Bairro</label>
              <input type="text" name="bairro" value={formData.bairro} readOnly />
            </div>
            <div className="form-group">
              <label>Cidade</label>
              <input type="text" name="cidade" value={formData.cidade} readOnly />
            </div>
            <div className="form-group">
              <label>Estado</label>
              <input type="text" name="estado" value={formData.estado} readOnly />
            </div>
            <div className="form-group">
              <label>Complemento</label>
              <input type="text" name="complemento" value={formData.complemento} onChange={handleChange} />
            </div>
            </div>
        </fieldset>
      )}

      {currentStep === 3 && (
        <fieldset>
              <legend>Situação Social</legend>
              <div className="form-group">
                <label>Recebe cesta básica?</label>
                <select name="cesta_basica" value={formData.cesta_basica} onChange={handleChange}>
                  <option value="nao">Não</option>
                  <option value="sim">Sim</option>
                </select>
                <div className="form-group">
                  <label>Data da Consulta com Assistente Social</label>
                  <input type="date" name="data_assistente_social" value={formData.data_assistente_social} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Data da Anamnese</label>
                  <input type="date" name="anamnese" value={formData.anamnese} onChange={handleChange} />
                </div>
              </div>
            </fieldset>
      )}

          {currentStep === 4 && (
       <fieldset>
       <legend>Anexos</legend>
     
       <div className="form-group">
         <label>Documento de Identidade</label>
         {filePreviews.anexo_id_url ? (
           <div>
             <a className="preview-link" href={filePreviews.anexo_id_url} target="_blank" rel="noopener noreferrer">
               📄 Visualizar Documento Atual
             </a>
           </div>
         ) : (
           <p className="no-file">Nenhum arquivo disponível</p>
         )}
         <input type="file" name="anexo_id" onChange={handleFileChange} />
       </div>
     
       <div className="form-group">
         <label>Comprovante de Residência</label>
         {filePreviews.anexo2_id_url ? (
           <div>
             <a className="preview-link" href={filePreviews.anexo2_id_url} target="_blank" rel="noopener noreferrer">
               📄 Visualizar Comprovante Atual
             </a>
           </div>
         ) : (
           <p className="no-file">Nenhum arquivo disponível</p>
         )}
         <input type="file" name="anexo2_id" onChange={handleFileChange} />
       </div>
     
       <div className="form-group">
         <label>Comprovante de Renda</label>
         {filePreviews.anexo3_id_url ? (
           <div>
             <a className="preview-link" href={filePreviews.anexo3_id_url} target="_blank" rel="noopener noreferrer">
               📄 Visualizar Comprovante Atual
             </a>
           </div>
         ) : (
           <p className="no-file">Nenhum arquivo disponível</p>
         )}
         <input type="file" name="anexo3_id" onChange={handleFileChange} />
       </div>
     </fieldset>
     
      
          )}

        <div className="buttons">
          {currentStep > 1 && (
            <button type="button" className="prev" onClick={handlePrev}>
              Voltar
            </button>
          )}

          {currentStep < totalSteps ? (
            <button 
              type="button" 
              className="next" 
              onClick={() => {
                console.log("Step atual:", currentStep); // Debugging
                if (currentStep < totalSteps) {
                  handleNext(); 
                }
              }}
            >
              Próximo
            </button>
          ) : null}

          {currentStep === totalSteps && (
            <button type="submit" className="submit">
              Atualizar
            </button>
          )}
        </div>

  
      </form>
    </div>

  );
}

export default EditarAssistido;
