// frontend/src/pages/assistidos/EditarAssistido.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../assets/css/cadastroAssistidos.css"; // Reaproveitando os mesmos estilos
import { mostrarSucesso, mostrarErro } from "../../components/SweetAlert"; // Funções de alerta
import { AuthContext } from "../../context/AuthContext";

function EditarAssistido() {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams(); // ID do assistido a ser editado

  const totalSteps = 4;
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    // Seção 1: Informações Pessoais
    nome: "",
    cpf: "",
    nascimento: "",
    genero: "",
    celular: "",
    email: "",
    // Seção 2: Endereço
    cep: "",
    endereco: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    complemento: "",
    // Seção 3: Situação Social
    de_menor: "nao", // "sim" ou "nao"
    parentesco: "",
    cesta_basica: "nao", // "sim" ou "nao"
    data_assistente_social: "",
    anamnese: "",
    // Seção 4: Anexos (arquivos serão enviados apenas se houver nova alteração)
    anexo_id: null,
    anexo2_id: null,
    anexo3_id: null,
  });

  // Função para buscar os dados do assistido a ser editado
  useEffect(() => {
    const fetchAssistido = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/assistidos/${id}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        const data = await response.json();
        // Preenche o formData com os dados recebidos
        setFormData({
          nome: data.nome || "",
          cpf: data.cpf || "",
          nascimento: data.nascimento || "",
          genero: data.genero || "",
          celular: data.celular || "",
          email: data.email || "",
          cep: data.cep || "",
          endereco: data.endereco || "",
          numero: data.numero || "",
          bairro: data.bairro || "",
          cidade: data.cidade || "",
          estado: data.estado || "",
          complemento: data.complemento || "",
          de_menor: data.de_menor || "nao",
          parentesco: data.Parentesto || "", // Atenção: verifique o nome do campo
          cesta_basica: data.cesta_basica || "nao",
          data_assistente_social: data.data_assistente_social || "",
          anamnese: data.anamnese || "",
          // Os arquivos não são pré-carregados, logo os campos ficam null
          anexo_id: null,
          anexo2_id: null,
          anexo3_id: null,
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

  // Função para atualizar campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Função para tratar upload de arquivos
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, [name]: "Formato de arquivo inválido. Apenas PDF, JPG e PNG são permitidos." }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, [name]: "Tamanho do arquivo excede 5MB." }));
        return;
      }
      setErrors(prev => ({ ...prev, [name]: "" }));
      setFormData(prev => ({ ...prev, [name]: file }));
    }
  };

  // Função para buscar dados do CEP (para preencher endereço)
  const fetchCEP = async () => {
    if (formData.cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${formData.cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            endereco: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            estado: data.uf || ""
          }));
          setErrors(prev => ({ ...prev, cep: "" }));
        } else {
          setErrors(prev => ({ ...prev, cep: "CEP não encontrado!" }));
        }
      } catch (error) {
        setErrors(prev => ({ ...prev, cep: "Erro ao buscar CEP." }));
      }
    }
  };

  // Função de validação por etapa (similares às usadas no cadastro)
  const validateStep = (step) => {
    let newErrors = {};
    const now = new Date();
    if (step === 1) {
      if (!formData.nome || formData.nome.trim().length < 3) {
        newErrors.nome = "Nome deve ter pelo menos 3 caracteres.";
      }
      const cpfNumeric = formData.cpf.replace(/\D/g, "");
      if (!cpfNumeric || cpfNumeric.length !== 11) {
        newErrors.cpf = "CPF deve conter exatamente 11 dígitos.";
      }
      if (!formData.nascimento) {
        newErrors.nascimento = "Data de nascimento é obrigatória.";
      } else {
        const nascDate = new Date(formData.nascimento);
        if (nascDate > now) {
          newErrors.nascimento = "Data de nascimento não pode ser futura.";
        }
      }
      if (!formData.genero) {
        newErrors.genero = "Selecione o gênero.";
      }
      const celularNumeric = formData.celular.replace(/\D/g, "");
      if (!celularNumeric || celularNumeric.length !== 11) {
        newErrors.celular = "Celular deve conter 11 dígitos.";
      }
      if (!formData.email) {
        newErrors.email = "E-mail é obrigatório.";
      }
    }
    if (step === 2) {
      const cepNumeric = formData.cep.replace(/\D/g, "");
      if (!cepNumeric || cepNumeric.length !== 8) {
        newErrors.cep = "CEP deve conter exatamente 8 dígitos.";
      }
      if (!formData.endereco) {
        newErrors.endereco = "Endereço é obrigatório.";
      }
      if (!formData.numero) {
        newErrors.numero = "Número é obrigatório.";
      }
    }
    if (step === 3) {
      if (formData.de_menor === "sim" && !formData.parentesco) {
        newErrors.parentesco = "Parentesco é obrigatório para assistidos menores.";
      }
    }
    return newErrors;
  };

  const validateForm = () => {
    const errosEtapa1 = validateStep(1);
    const errosEtapa2 = validateStep(2);
    const errosEtapa3 = validateStep(3);
    const newErrors = { ...errosEtapa1, ...errosEtapa2, ...errosEtapa3 };
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
    } else {
      setErrors({});
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setErrors({});
    setCurrentStep(prev => prev - 1);
  };

  // Permite saltar para uma etapa específica pelo menu de navegação
  const handleMenuClick = (step) => {
    setErrors({});
    setCurrentStep(step);
  };

  // Função para enviar os dados atualizados (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    if (validateForm()) {
      try {
        const submissionData = new FormData();
        for (const key in formData) {
          submissionData.append(key, formData[key]);
        }
        // Adiciona o ID do usuário logado
        submissionData.append("executado_por", user.id);

        const response = await fetch(`http://localhost:5000/api/assistidos/${id}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: submissionData,
        });

        if (response.ok) {
          mostrarSucesso("Sucesso", "Assistido atualizado com sucesso!");
          setTimeout(() => {
            navigate("/listarassistido");
          }, 1500);
        } else {
          mostrarErro("Erro", "Erro ao atualizar cadastro. Verifique os dados e tente novamente.");
        }
      } catch (error) {
        console.error(error);
        mostrarErro("Erro", "Erro ao atualizar cadastro. Tente novamente mais tarde.");
      }
    }
  };

  const handleReset = () => {
    // Opcional: redefinir para os dados originais ou limpar os campos
    setFormData({
      nome: "",
      cpf: "",
      nascimento: "",
      genero: "",
      celular: "",
      email: "",
      cep: "",
      endereco: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      complemento: "",
      de_menor: "nao",
      parentesco: "",
      cesta_basica: "nao",
      data_assistente_social: "",
      anamnese: "",
      anexo_id: null,
      anexo2_id: null,
      anexo3_id: null,
    });
    setErrors({});
    setSuccessMessage("");
    setCurrentStep(1);
  };

  if (loading) {
    return <div className="loading">Carregando dados do assistido...</div>;
  }

  return (
    <div className="cadastro-container">
      <h1>Editar Assistido</h1>

      {/* Menu de navegação das seções */}
      <div className="steps-menu">
        <button className={currentStep === 1 ? "active" : ""} onClick={() => handleMenuClick(1)}>
          Informações Pessoais
        </button>
        <button className={currentStep === 2 ? "active" : ""} onClick={() => handleMenuClick(2)}>
          Endereço
        </button>
        <button className={currentStep === 3 ? "active" : ""} onClick={() => handleMenuClick(3)}>
          Situação Social
        </button>
        <button className={currentStep === 4 ? "active" : ""} onClick={() => handleMenuClick(4)}>
          Anexos
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Etapa 1: Informações Pessoais */}
        {currentStep === 1 && (
          <fieldset>
            <legend>Informações Pessoais</legend>
            <div className="form-group">
              <label>Nome Completo</label>
              <input type="text" name="nome" value={formData.nome} onChange={handleChange} />
              {errors.nome && <span className="error">{errors.nome}</span>}
            </div>
            <div className="form-group">
              <label>CPF</label>
              <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} maxLength="11" />
              {errors.cpf && <span className="error">{errors.cpf}</span>}
            </div>
            <div className="form-group">
              <label>Data de Nascimento</label>
              <input type="date" name="nascimento" value={formData.nascimento} onChange={handleChange} />
              {errors.nascimento && <span className="error">{errors.nascimento}</span>}
            </div>
            <div className="form-group">
              <label>Gênero</label>
              <select name="genero" value={formData.genero} onChange={handleChange}>
                <option value="">Selecione</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
              </select>
              {errors.genero && <span className="error">{errors.genero}</span>}
            </div>
            <div className="form-group">
              <label>Celular</label>
              <input type="text" name="celular" value={formData.celular} onChange={handleChange} placeholder="(XX) 9XXXX-XXXX" />
              {errors.celular && <span className="error">{errors.celular}</span>}
            </div>
            <div className="form-group">
              <label>E-mail</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
          </fieldset>
        )}

        {/* Etapa 2: Endereço */}
        {currentStep === 2 && (
          <fieldset>
            <legend>Endereço</legend>
            <div className="form-group">
              <label>CEP</label>
              <input type="text" name="cep" value={formData.cep} onChange={handleChange} onBlur={fetchCEP} maxLength="8" />
              {errors.cep && <span className="error">{errors.cep}</span>}
            </div>
            <div className="form-group">
              <label>Rua</label>
              <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} readOnly />
              {errors.endereco && <span className="error">{errors.endereco}</span>}
            </div>
            <div className="form-group">
              <label>Número</label>
              <input type="text" name="numero" value={formData.numero} onChange={handleChange} />
              {errors.numero && <span className="error">{errors.numero}</span>}
            </div>
            <div className="form-group">
              <label>Bairro</label>
              <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} readOnly />
            </div>
            <div className="form-group">
              <label>Cidade</label>
              <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} readOnly />
            </div>
            <div className="form-group">
              <label>Estado</label>
              <input type="text" name="estado" value={formData.estado} onChange={handleChange} readOnly />
            </div>
            <div className="form-group">
              <label>Complemento</label>
              <input type="text" name="complemento" value={formData.complemento} onChange={handleChange} />
            </div>
          </fieldset>
        )}

        {/* Etapa 3: Situação Social */}
        {currentStep === 3 && (
          <fieldset>
            <legend>Situação Social</legend>
            <div className="form-group">
              <label>Assistido é menor de idade?</label>
              <select name="de_menor" value={formData.de_menor} onChange={handleChange}>
                <option value="nao">Não</option>
                <option value="sim">Sim</option>
              </select>
            </div>
            {formData.de_menor === "sim" && (
              <div className="form-group">
                <label>Parentesco</label>
                <input type="text" name="parentesco" value={formData.parentesco} onChange={handleChange} />
                {errors.parentesco && <span className="error">{errors.parentesco}</span>}
              </div>
            )}
            <div className="form-group">
              <label>Recebe cesta básica?</label>
              <select name="cesta_basica" value={formData.cesta_basica} onChange={handleChange}>
                <option value="nao">Não</option>
                <option value="sim">Sim</option>
              </select>
            </div>
            <div className="form-group">
              <label>Data do Atendimento com Assistente Social</label>
              <input type="date" name="data_assistente_social" value={formData.data_assistente_social} onChange={handleChange} />
              {errors.data_assistente_social && <span className="error">{errors.data_assistente_social}</span>}
            </div>
            <div className="form-group">
              <label>Observações (Anamnese)</label>
              <textarea name="anamnese" value={formData.anamnese} onChange={handleChange}></textarea>
            </div>
          </fieldset>
        )}

        {/* Etapa 4: Anexos */}
        {currentStep === 4 && (
          <fieldset>
            <legend>Anexos</legend>
            <div className="form-group">
              <label>Documento de Identidade (PDF, JPG, PNG)</label>
              <input type="file" name="anexo_id" onChange={handleFileChange} />
              {errors.anexo_id && <span className="error">{errors.anexo_id}</span>}
            </div>
            <div className="form-group">
              <label>Comprovante de Residência (PDF, JPG, PNG)</label>
              <input type="file" name="anexo2_id" onChange={handleFileChange} />
              {errors.anexo2_id && <span className="error">{errors.anexo2_id}</span>}
            </div>
            <div className="form-group">
              <label>Outros Documentos (PDF, JPG, PNG)</label>
              <input type="file" name="anexo3_id" onChange={handleFileChange} />
              {errors.anexo3_id && <span className="error">{errors.anexo3_id}</span>}
            </div>
          </fieldset>
        )}

        {errors.submit && <div className="error">{errors.submit}</div>}
        {successMessage && <div className="success">{successMessage}</div>}

        <div className="buttons">
          {currentStep > 1 && (
            <button type="button" className="prev" onClick={handlePrev}>
              Voltar
            </button>
          )}
          {currentStep < totalSteps && (
            <button type="button" className="next" onClick={handleNext}>
              Próximo
            </button>
          )}
          {currentStep === totalSteps && (
            <button type="submit" className="submit">
              Atualizar
            </button>
          )}
          <button type="button" className="reset" onClick={handleReset}>
            Limpar Formulário
          </button>
          <button type="button" className="cancel" onClick={() => navigate(-1)}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarAssistido;
