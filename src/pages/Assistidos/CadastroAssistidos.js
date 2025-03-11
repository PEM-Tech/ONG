import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/cadastroAssistidos.css";
import { mostrarSucesso, mostrarErro } from "../../components/SweetAlert";
import { AuthContext } from "../../context/AuthContext";
import InputMask from "react-input-mask";
import { fetchAddressByCep } from "../../services/cepService";
import { removeMask } from "../../services/utils";

function CadastroAssistidos() {
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);

  const totalSteps = 4;
  const [currentStep, setCurrentStep] = useState(1);
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

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handlePrev = () => setCurrentStep((prev) => prev - 1);

  const handleCEP = async () => {
    try {
      const addressData = await fetchAddressByCep(formData.cep);
      setFormData((prev) => ({
        ...prev,
        endereco: addressData.endereco,
        bairro: addressData.bairro,
        cidade: addressData.cidade,
        estado: addressData.estado,
      }));
      setErrors((prev) => ({ ...prev, cep: "" }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, cep: error.message }));
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submissionData = new FormData();
      for (const key in formData) {
        submissionData.append(key, formData[key]);
      }
      submissionData.append("executado_por", user.id);

      const response = await fetch("http://localhost:5000/api/assistidos", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: submissionData,
      });

      if (response.ok) {
        mostrarSucesso("Sucesso", "Assistido cadastrado com sucesso!");
        setTimeout(() => navigate("/listarassistido"), 1500);
      } else {
        mostrarErro("Erro", "Erro ao cadastrar assistido.");
      }
    } catch (error) {
      mostrarErro("Erro", "Erro ao cadastrar assistido. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="cadastro-container">
      <h1>Cadastro de Assistido</h1>
      <button className="back-button" onClick={() => navigate(-1)}>⬅ Sair</button>
      <form onSubmit={handleSubmit}>
          {/* Etapa 1: Informações Pessoais */}
          {currentStep === 1 && (
          <fieldset>
            <legend>Informações Pessoais</legend>
            <div className="form-grid">
              <div className="form-group">
                <label>Ficha</label>
                <input
                  type="number"
                  name="ficha"
                  value={formData.ficha}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Nome Completo</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                />
                {errors.nome && <span className="error">{errors.nome}</span>}
              </div>
              <div className="form-group">
                <label>CPF</label>
                <InputMask
                  mask="999-999-999-99"
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                />
                {errors.cpf && <span className="error">{errors.cpf}</span>}
              </div>
              <div className="form-group">
                <label>Data de Nascimento</label>
                <input
                  type="date"
                  name="nascimento"
                  value={formData.nascimento}
                  onChange={handleChange}
                />
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
                <InputMask
                  mask="(99) 99999-9999"
                  type="text"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
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

        {/* Etapa 2: Endereço */}
        {currentStep === 2 && (
          <fieldset>
           
            <legend>Endereço</legend>
            <div className="form-grid">
            <div className="form-group">
              <label>CEP</label>
              <input
                type="text"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                onBlur={handleCEP}
                maxLength="8"
              />
              {errors.cep && <span className="error">{errors.cep}</span>}
            </div>
            <div className="form-group">
              <label>Rua</label>
              <input
                type="text"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                readOnly
              />
              {errors.endereco && <span className="error">{errors.endereco}</span>}
            </div>
            <div className="form-group">
              <label>Número</label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
              />
              {errors.numero && <span className="error">{errors.numero}</span>}
            </div>
            <div className="form-group">
              <label>Bairro</label>
              <input
                type="text"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Cidade</label>
              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Estado</label>
              <input
                type="text"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Complemento</label>
              <input
                type="text"
                name="complemento"
                value={formData.complemento}
                onChange={handleChange}
              />
            </div>
            </div>
          </fieldset>
        )}

        {/* Etapa 3: Situação Social */}
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

        {/* Etapa 4: Anexos */}
        {currentStep === 4 && (
          <fieldset>
            <legend>Anexos</legend>
            <div className="form-group">
              <label>Documento de Identidade</label>
              <input type="file" name="anexo_id" onChange={handleFileChange} />
              {errors.anexo_id && <span className="error">{errors.anexo_id}</span>}
            </div>
            <div className="form-group">
              <label>Comprovante de Residência</label>
              <input type="file" name="anexo2_id" onChange={handleFileChange} />
              {errors.anexo_endereco && <span className="error">{errors.anexo2_id}</span>}
            </div>
            <div className="form-group">
              <label>Comprovante de Renda</label>
              <input type="file" name="anexo3_id" onChange={handleFileChange} />
              {errors.anexo3_id && <span className="error">{errors.anexo3_id}</span>}
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
              Cadastrar
            </button>
          )}
        </div>

      </form>
    </div>
  );
}

export default CadastroAssistidos;
