import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/Anamnese.css";
import { mostrarSucesso, mostrarErro } from "../../components/SweetAlert";
import { AuthContext } from "../../context/AuthContext";
import InputMask from "react-input-mask";

function Anamnese() {
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  const totalSteps = 17;
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
    endereco: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    complemento: "",
    medicamentos: "nao",
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
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Se "de_menor" for alterado para "não", limpar assistido_id e parentesco
      assistido_id: name === "de_menor" && value === "nao" ? "" : prev.assistido_id,
      parentesco: name === "de_menor" && value === "nao" ? "" : prev.parentesco,
    }));
  };

  const removeMask = (value) => {
    return value.replace(/\D/g, ""); // Remove tudo que não for número
  };

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submissionData = new FormData();
      for (const key in formData) {
        submissionData.append(key, formData[key]);
      }

      // Removendo máscaras antes de enviar
      submissionData.set("cpf", removeMask(formData.cpf));
      submissionData.set("celular", removeMask(formData.celular));
      submissionData.set("cep", removeMask(formData.cep));
      submissionData.append("executado_por", user.id);

      const response = await fetch("http://localhost:5000/api/assistidos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submissionData,
      });

      if (response.ok) {
        mostrarSucesso("Sucesso", "Assistido cadastrado com sucesso!");
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else {
        mostrarErro("Erro", "Erro ao salvar cadastro.");
      }
    } catch (error) {
      mostrarErro("Erro", "Erro ao salvar cadastro.");
    }
  };

  //função pra resetar os campos do formulário
  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      ficha: "",
      nome: "",
      cpf: "",
      nascimento: "",
      genero: "",
      email: "",
      celular: "",
      email: "",
      cep: "",
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      complemento: "",
      medicamentos: "nao",
      assistido_id: "",
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

  return (
    <div className="cadastro-container">
      <div className="title-container">
        <button className="back-button" onClick={() => navigate(-1)}>⬅ Sair</button>
        <h1>Anamnese</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* 🔹 Etapa 1: Dados de Identificação */}
        {currentStep === 1 && (
          <fieldset>
            <legend>Dados de Identificação</legend>
            <div className="form-grid2  ">
            <div className="form-group">
              <label>Nome Completo</label>
              <input type="text" name="Nome" value={formData.nome} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Data de Nascimento</label>
              <input type="date" name="nascimento" value={formData.nascimento} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Idade</label>
              <input type="number" name="idade" value={formData.idade} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Série</label>                
              <input type="text" name="serie" value={formData.serie} onChange={handleChange}  />
            </div>
            <div className="form-group">
                <label>Turno</label>
            <input type="text" name="turno" value={formData.turno} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Nome do Responsável 1</label>
              <input  type="text" name="responsavel1" value={formData.responsavel1} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Idade do Responsavel 1</label>
              <input type="number" name="idade_responsavel1" value={formData.idade_responsavel1} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Profissão do Responsavel 1</label>
              <input name="profissao_responsavel1" value={formData.profissao_responsavel1} onChange={handleChange} />
            </div>
            <div className="form-group">                
              <label>Endereço da Residência 1</label>
              <input type="text" name="endereço_residência" value={formData.endereço_residência} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Contato Responsável 1</label>
              <InputMask mask={'(99) 99999-9999'} type="text" name="contato" value={formData.contato} onChange={handleChange} />
            </div>   
            <div className="form-group">
              <label>Religião do Responsavel 1</label>
              <input type="text" name="religiao1" value={formData.religiao1} onChange={handleChange} />
            </div> 
            <div className="form-group">
              <label>Nome do Responsável 2</label>
              <input type="text" name="responsavel2" value={formData.responsavel2} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Idade do Responsavel 2</label>
              <input type="number" name="idade_responsavel2" value={formData.idade_responsavel2} onChange={handleChange} />
            </div>
            <div className="form-group">                
              <label>Endereço da Residência 2</label>
              <input type="text" name="endereço_residência" value={formData.endereço_residência} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Contato Responsável 2</label>
              <InputMask mask={'(99) 99999-9999'} type="text" name="contato" value={formData.contato} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Religião do Responsavel 2</label>
              <input type="text" name="religiao2" value={formData.religiao2} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>A guarda está em nome de:</label>
              <input type="text" name="guarda" value={formData.guarda} onChange={handleChange} />
            </div>
    
             </div>
          </fieldset>
          
        )}

         {/* 🔹 Etapa 2: Queixa Principal */}
         {currentStep === 2 && (
          <fieldset>
            <legend>Queixa Principal</legend>
            <div className="form-group">
              <label>Historico Clínico</label>
              <input type="text" name="historico" value={formData.historico} onChange={handleChange}  />           
            </div>
            <div className="form-grid">  
            <div className="form-group">
              <label>Medicamentos</label>
              <select name="medicamentos" value={formData.medicamentos} onChange={handleChange}>
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>

             {/* 🔹 Mostrar quais apenas se "medicamentos" for "sim" */}
            {formData.medicamentos === "sim" && (
              <>
                <div className="form-group">
                  <label>Quais?</label>
                  <input type="text" name="quais" value={formData.quais} onChange={handleChange} />
                </div>
              </>
              
            )}
            </div>
            <div className="form-group">
              <label>Casos de internação</label>
              <input type="text" name="internacao" value={formData.internacao} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Psicoterapia/fono/fisio/neuro/psiquiatra</label>
              <input type="text" name="psico" value={formData.psico}  />
            </div>
            </div>
          </fieldset>
        )}

         {/* 🔹 Etapa 3: Gestação e Nascimento */}
         {currentStep === 3 && (
            <fieldset>
              <legend>Sobre a Gestação e Nascimento</legend>
     
              <div className="form-group">
                <label>Foi Planejada?</label>
                <select name="planejada" value={formData.planejada} onChange={handleChange}>
                  <option value="nao">Não</option>
                  <option value="sim">Sim</option>
                </select>
              </div>
                <div className="form-group">
                  <label>Cesária ou Normal?</label>
                  <select name="cesaria" value={formData.cesaria} onChange={handleChange}>
                    <option value="cesaria">Cesária</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Pré Natal</label>
                  <select name="pre_natal" value={formData.pre_natal} onChange={handleChange}>
                    <option value="sim">Sim</option>
                    <option value="nao">Nao</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Drogas ou Alcool na Gestação</label>
                  <select name="post_natal" value={formData.post_natal} onChange={handleChange}>
                    <option value="sim">Sim</option>
                    <option value="nao">Nao</option>
                  </select>
                </div>
                <div className="form-group">
              <label>Algum uso de Medicamentos</label>
              <select name="medicamentos_gestacao" value={formData.medicamentos_gestacao} onChange={handleChange}>
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>

             {/* 🔹 Mostrar quais apenas se "medicamentos" for "sim" */}
            {formData.medicamentos_gestacao === "sim" && (
              <>
                <div className="form-group">
                  <label>Quais?</label>
                  <input type="text" name="quais" value={formData.quais} onChange={handleChange} />
                </div>
              </>
              
            )}
            </div>
                <div className="form-group">
                  <label>Algum evento significativo?</label>
                    <input type="text"  name="evento" value={formData.evento} onChange={handleChange}/>
                  </div>
                <div className="form-group">
                    <label>Quantas semanas de gestação ao nascer?</label>
                    <input type="number" name="semanas" value={formData.semanas} onChange={handleChange}/>
                </div>
                <div className="form-group">
                    <label>Nota de apgar?</label>
                    <input type="text" name="apgar" value={formData.apgar} onChange={handleChange}/>
                </div>
                <div className="form-group">
                    <label>Como foi o processo de amamentação e desmame?</label>
                    <input type="text" name="amamentacao" value={formData.amamentacao} onChange={handleChange}/>
                </div>
         
            </fieldset>
          )}

         {/* 🔹 Etapa 4: psicomotor */}
          {currentStep === 4 && (
            <fieldset>
              <legend>Desenvolvimento Psicomotor</legend>
              <div className="form-group">
                <label>Quando sustentou a cabeça?</label>
                <input type="text" name="sustentou" value={formData.sustentou} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Quando sentou sozinho?</label>
                <input type="text" name="sentou" value={formData.sentou} onChange={handleChange } />
              </div>
              <div className="form-group">
                <label>Quando engatinhou?</label>
                <input type="text" name="engatinhar" value={formData.engatinhar} onChange={handleChange}/>
              </div>
              <div className="form-group">
                <label>Quando Andou?</label>
                <input type="text" name="andou" value={formData.andou} onChange={handleChange}/>
              </div>
              <div className="form-group">
                <label>Desfraulde?</label>
                <input type="text" name="desfraulde" value={formData.desfraulde} onChange={handleChange}/>
              </div>
              <div className="form-group">
                <label>Controla evacuação-micção?</label>
               <select name="evacuacao" value={formData.evacuacao} onChange={handleChange}>
                  <option value="sim">Sim</option>
                  <option value="nao">Nao</option>
                </select>
              </div>
          
            </fieldset>
          )}

          {/* 🔹 Etapa 5: linguagem */	}
          {currentStep === 5 &&(

            <fieldset>
            <legend>linguagem</legend>









            </fieldset>
          )}

       {/* 🔹 Botões de Navegação */}
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

export default Anamnese;
