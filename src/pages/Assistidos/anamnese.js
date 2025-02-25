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
            {formData.medicamentos === "Sim" && (
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
                <option value="nao">Nao</option>
                <option value="sim">Sim</option>
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
            <div className="form-group">
              <label>Quando iniciou a fala?</label>
              <input type="text" name="iniciou_fala" value={formData.iniciou_fala} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Apresenta Dificuldade?</label>
              <select name="dificuldade" value={formData.dificuldade} onChange={handleChange}>
               <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>
              {/*🔹 Mostrar quais apenas se "dificuldade" for "sim" */}
              {formData.dificuldade === "Sim" && (
                <>
                  <div className="form-group">
                    <label>Quais?</label>
                    <input type="text" name="quais_linguagem" value={formData.quais_linguagem} onChange={handleChange}/>
                  </div>
                </>
              )}
            </div> 
            <div className="form-group">
              <label>Tem boa compreenção verbal?</label>
              <select name="compreensao_verbal" value={formData.compreensao_verbal} onChange={handleChange}>
                <option value="sim">Sim</option>
                <option value="nao">Nao</option>
              </select>
            </div>
            <div className="form-group">
              <label>Comunica-se de forma verbal ou não verbal?</label>
              <select name="comunica_verbal" value={formData.comunica_verbal} onChange={handleChange}>
                <option value="sim">Sim</option>
                <option value="nao">Nao</option>
              </select>
            </div>
            <div className="form-group">
              <label>Comunica-se através da escrita?(escreve, copia, recorta, rasga, desenha...)</label>
              <input type="text" name="escrita" value={formData.escrita} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Consegue seguir comandos(simples e complexos)??</label>
              <input type="text" name="comandos" value={formData.comandos} onChange={handleChange}/>
            </div>
            </fieldset>
          )}

          {/* 🔹 Etapa 6: habitos alimentares */}
          {currentStep === 6 && (
            <fieldset>
            <legend>Habitos Alimentares</legend>
            <div className="form-group">
              <label>Refeições por dia</label>
              <input type="number" name="refeicoes_por_dia" value={formData.refeicoes_por_dia} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Dificuldade com algum alimento ou seletividade alimentar?</label>
              <input type="text" name="dificuldade_alimentar" value={formData.dificuldade_alimentar} onChange={handleChange}/>
            </div>
            </fieldset>
          )}

          {/* 🔹 Etapa 7: dados sobre o sono */}
          {currentStep === 7 && (
            <fieldset>
            <legend>Dados sobre o Sono</legend>
            <div className="form-group">
              <label>Como é o sono?</label>
              <input type="text" name="como_e_sono" value={formData.como_e_sono} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Teve alguma alteração de sono significativo em alguma outra fase da vida?</label>
              <input type="text" name="alteracao_sono" value={formData.alteracao_sono} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Divide quarto ou cama com alguém?</label>
              <input type="text" name="divide_cama" value={formData.divide_cama} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Tem algum hábito ou rotina noturna?</label>
              <input type="text" name="rotina_noturna" value={formData.rotina_noturna} onChange={handleChange}/>
            </div>
            </fieldset>
          )}

          {/* 🔹 Etapa 8: dados sobre a saúde */}
          {currentStep === 8 && (
            <fieldset>
            <legend>Dados sobre a Saude</legend>
            <div className="form-group">
              <label>Casos de convulsões, eplepsia, desmaia e etc?</label>
              <input type="text" name="casos_saude" value={formData.casos_saude} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Alergias?</label>
              <select name="alergias" value={formData.alergias} onChange={handleChange}>
               <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>
               {/*🔹 Mostrar quais apenas se "dificuldade" for "sim" */}
               {formData.alergias === "Sim" && (
                <>
                  <div className="form-group">
                    <label>Quais?</label>
                    <input type="text" name="quais_alergias" value={formData.quais_alergias} onChange={handleChange}/>
                  </div>
                </>
              )}
            </div>
            <div className="form-group">
              <label>Tomou todas as vacinas?</label>
              <input type="text" name="vacinas" value={formData.vacinas} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Ja fez exames específicos?</label>
              <input type="text" name="maior_dificuldade" value={formData.maior_dificuldade} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <legend>Dificuldades</legend>
              <label>Visão</label>
              <select name="visao" value={formData.visao} onChange={handleChange}> 
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>
              <label>Audição</label>
              <select name="audicao" value={formData.audicao} onChange={handleChange}>
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>
            </div>
            </fieldset>
          )}

          {/* 🔹 Etapa 9: manipulação e hábitos */}
          
          {currentStep === 9 && (
            <fieldset>
            <legend>Manipulação e Hábitos</legend>
            <div className="form-group">
              <label>Usou chupeta?</label>
              <select name="chupeta" value={formData.chupeta} onChange={handleChange}>
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>
                {/*🔹 Mostrar quais apenas se "chupeta" for "sim" */}
                {formData.chupeta === "Sim" && (
                <>
                  <div className="form-group">
                    <label>Até quando?</label>
                    <input type="text" name="ate_quando_chupeta" value={formData.ate_quando_chupeta} onChange={handleChange}/>
                  </div>
                </>
              )}
            </div>
            <div className="form-group">
              <label>Roeu as unhas?</label>
              <select name="unhas" value={formData.unhas} onChange={handleChange}>
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>
                {/*🔹 Mostrar quais apenas se "unhas" for "sim" */}
                {formData.unhas === "Sim" && (
                <>
                  <div className="form-group">
                    <label>Até quando?</label>
                    <input type="text" name="ate_quando_unhas" value={formData.ate_quando_unhas} onChange={handleChange}/>
                  </div>
                </>
              )}
            </div>
            <div className="form-group">
              <label>Algum tique ou manias?</label>
              <select name="manias" value={formData.manias} onChange={handleChange}>
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>
                {/*🔹 Mostrar quais apenas se "manias" for "sim" */}
                {formData.manias === "Sim" && (
                <>
                  <div className="form-group">
                    <label>Até quando?</label>
                    <input type="text" name="quais_manias" value={formData.quais_manias} onChange={handleChange}/>
                  </div>
                </>
              )}
            </div>
            <div className="form-group">
              <label>Como reage a mudanças na rotina e nos hábitos?</label>
              <input  type="text" name="mudança_rotina" value={formData.mudança_rotina} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Como lida com frustrações?</label>
              <input  type="text" name="lida_frustações" value={formData.lida_frustações} onChange={handleChange}/>
            </div>
            </fieldset>
          )}

          {/* 🔹 Etapa 10: Sexualidade */}

          {currentStep === 10 && (
            <fieldset>
            <legend>Sexualidade</legend>
            <div className="form-group">
              <label>Já demonstrou curiosidade sexual?</label>
              <select name="curiosidade_sexual" value={formData.curiosidade_sexual} onChange={handleChange}>
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>
            </div>
            <div className="form-group">
              <label>Apresenta atitudes com outras pessoas?</label>
              <input type="text" name="atitudes_sexuais" value={formData.atitudes_sexuais} onChange={handleChange}/>
            </div>
            
            <div className="form-group">
              <label>Atitude da familia em relação à sexualidade?</label>
              <input type="text" name="familia_sexualidade" value={formData.familia_sexualidade} onChange={handleChange}/>
            </div>
            </fieldset>
          )}

          {/* 🔹 Etapa 11: Dados sobre sociabilidade */}

          {currentStep === 11 && (
            <fieldset>
            <legend>Dados sobre Sociabilidade</legend>
            <div className="form-group">
              <label>O que faz quando não está na escola/faculdade/trabalho?</label>
              <input  type="text" name="fora_escola" value={formData.fora_escola} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Tem amigos? Brinca/sai sozinho ou acompanhado</label>
              <input  type="text" name="amigos" value={formData.amigos} onChange={handleChange}/>
            </div>
            <div className="form-group">  
              <label>Faz amizade facilmente? Interage com facilidade?</label>
              <input  type="text" name="amizade" value={formData.amizade} onChange={handleChange}/>
            </div>
            <div className="form-group">  
              <label>Fala sozinho?</label>
              <select name="fala_sozinho" value={formData.fala_sozinho} onChange={handleChange}>
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
             </select>
            </div>
            <div className="form-group">  
              <label>Brinca de faz de conta?</label>
              <select name="faz_de_conta" value={formData.faz_de_conta} onChange={handleChange}>
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
             </select>
            </div>
            <div className="form-group">  
              <label>Imita animais?</label>
              <select name="imita_animais" value={formData.imita_animais} onChange={handleChange}>
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
             </select>
            </div>
            <div className="form-group">  
              <label>Imita Pessoas?</label>
             <select name="imita_pessoas" value={formData.imita_pessoas} onChange={handleChange}>
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
             </select>
            </div>
            </fieldset>
          )}

          {/* 🔹 Etapa 12: vestuario/higiene/organizacao */}

          {currentStep === 12 && (
            <fieldset>
            <legend>Vestuario/Higiene/Organizacao</legend>
            <div className="form-group">
              <label>Se veste sozinho?</label>
              <select name="veste_sozinho" value={formData.veste_sozinho} onChange={handleChange}>
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
             </select>
            </div>
            <div className="form-group">
              <label>Se penteia?</label>
              <select name="se_penteia" value={formData.se_penteia} onChange={handleChange}>
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
             </select>
            </div>
            <div className="form-group">
              <label>Toma banho sozinho?</label>
              <select name="banho_sozinho" value={formData.banho_sozinho} onChange={handleChange}>
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
             </select>
            </div>
            <div className="form-group">
              <label>Escova os dentes?</label>
              <select name="escova_dentes" value={formData.escova_dentes} onChange={handleChange}>
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
             </select>
            </div>
            <div className="form-group">
              <label>Faz nós e laços?</label>
              <select name="faz_laco" value={formData.faz_laco} onChange={handleChange}>
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
             </select>
            </div>
            <div className="form-group">
              <label>Arruma os seus materias e seus pertences?</label>
              <select name="arruma_pertences" value={formData.arruma_pertences} onChange={handleChange}>
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
             </select>
            </div>
            </fieldset>
          )}

          {/* 🔹 Etapa 13: antecedentes familiares */}

          {currentStep === 13 && (
            <fieldset>
            <legend>Antecedentes Familiares</legend>
            <div className="form-group">
              <label>Deficiências físicas?</label>
              <input  type="text" name="deficiencias_fisicas" value={formData.deficiencias_fisicas} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Mentais ou outras?</label>
              <input  type="text" name="deficiencias_mentais" value={formData.deficiencias_mentais} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Caso de alcoolismo?</label>
              <input  type="text" name="alcoolismo" value={formData.alcoolismo} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Historico de Suicídio?</label> 
              <input  type="text" name="historico_suicidio" value={formData.historico_suicidio} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Alergia</label>
              <input  type="text" name="historico_alergia" value={formData.historico_alergia} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Perda ou processo de luto na família</label>
              <input  type="text" name="luto_familia" value={formData.luto_familia} onChange={handleChange}/>
            </div>
        
            </fieldset>
          )}

          {/* 🔹 Etapa 14: relacionamento familiar */}

          {currentStep === 14 && (
            <fieldset>
            <legend>Relacionamento Familiar</legend>
            <div className="form-group">
              <label>Conflitos?</label>
              <select  type="text" name="conflitos_familiares" value={formData.conflitos_familiares} onChange={handleChange}>
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
             </select>
              {/*🔹 Mostrar quais apenas se "conflitos_familiares" for "sim" */}
              {formData.conflitos_familiares === "Sim" && (
                <>
                 <div className="form-group">
                    <label>Quais?</label>
                     <input  type="text" name="quais_conflitos" value={formData.quais_conflitos} onChange={handleChange}/>
                  </div>
                </>
              )}
            
            </div>
            <div className="form-group">
              <label>Historico e dinamica familiar?</label>
              <input  type="text" name="lida_frustações" value={formData.lida_frustações} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Como lidam com crises e birras?</label>
              <input  type="text" name="crises_birras" value={formData.crises_birras} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Com quem o paciente fica a maior parte do tempo?</label>
              <input  type="text" name="com_quem_fica" value={formData.com_quem_fica} onChange={handleChange}/>
            </div>
              <div className="form-group">
              <label>Demonstra comportamento de fuga ou agressividade?</label>
              <input  type="text" name="com_quem_se_relaciona" value={formData.com_quem_se_relaciona} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Ajuda nas tarefas?</label>
              <select name="ajuda_tarefas" value={formData.ajuda_tarefas} onChange={handleChange}>
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
             </select>
                 {/*🔹 Mostrar quais apenas se "ajuda_tarefas" for "sim" */}
                 {formData.conflitos_familiares === "Sim" && (
                <>
                 <div className="form-group">
                    <label>Quais?</label>
                     <input  type="text" name="quais_tarrefas" value={formData.quais_tarefas} onChange={handleChange}/>
                  </div>
                </>
              )}
            </div>
            </fieldset>
          )}

          {/* 🔹 Etapa 15: escolaridade */}

          {currentStep === 15 && (
            <fieldset>
            <legend>Escolaridade</legend>
            <div className="form-group">
              <label>Como reage a mudanças na rotina e nos hábitos?</label>
              <input  type="text" name="mudança_rotina" value={formData.mudança_rotina} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Como lida com frustrações?</label>
              <input  type="text" name="lida_frustações" value={formData.lida_frustações} onChange={handleChange}/>
            </div>
            </fieldset>
          )}

          {/* 🔹 Etapa 16: historico social */}

          {currentStep === 16 && (
            <fieldset>
            <legend>Historico Social</legend>
            <div className="form-group">
              <label>Como reage a mudanças na rotina e nos hábitos?</label>
              <input  type="text" name="mudança_rotina" value={formData.mudança_rotina} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Como lida com frustrações?</label>
              <input  type="text" name="lida_frustações" value={formData.lida_frustações} onChange={handleChange}/>
            </div>
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
