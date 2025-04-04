import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../assets/css/Anamnese.css";
import { mostrarSucesso, mostrarErro } from "../../components/SweetAlert";
import { AuthContext } from "../../context/AuthContext";
import InputMask from "react-input-mask";

// Objeto com os campos iniciais do formulário
const initialFormData = {
  assistido_id: "", // novo campo para identificação do assistido (obrigatório)
  nome: "",
  nascimento: "",
  cpf: "",
  celular: "",
  cep: "",
  serie: "",
  turno: "",
  responsavel1: "",
  idade_responsavel1: "",
  profissao_responsavel1: "",
  endereco_residencia1: "",
  contato1: "",
  religiao1: "",
  responsavel2: "",
  idade_responsavel2: "",
  endereco_residencia2: "",
  contato2: "",
  religiao2: "",
  guarda: "",
  historico: "",
  medicamentos: "Nao",
  quais_medicamentos: "",
  internacao: "",
  psico: "",
  planejada: "nao",
  cesaria: "normal",
  pre_natal: "sim",
  post_natal: "nao",
  medicamentos_gestacao: "nao",
  quais_medicamentos_gestacao: "",
  evento: "",
  semanas: "",
  apgar: "",
  amamentacao: "",
  sustentou: "",
  sentou: "",
  engatinhar: "",
  andou: "",
  desfraulde: "",
  evacuacao: "sim",
  iniciou_fala: "",
  dificuldade: "Nao",
  quais_linguagem: "",
  compreensao_verbal: "sim",
  comunica_verbal: "sim",
  escrita: "",
  comandos: "",
  refeicoes_por_dia: "",
  dificuldade_alimentar: "",
  como_e_sono: "",
  alteracao_sono: "",
  divide_cama: "",
  rotina_noturna: "",
  casos_saude: "",
  alergias: "Nao",
  quais_alergias: "",
  vacinas: "",
  maior_dificuldade: "",
  visao: "Nao",
  audicao: "Nao",
  chupeta: "Nao",
  ate_quando_chupeta: "",
  unhas: "Nao",
  ate_quando_unhas: "",
  manias: "Nao",
  quais_manias: "",
  mudanca_rotina: "",
  lida_frustracoes: "",
  curiosidade_sexual: "Nao",
  atitudes_sexuais: "",
  familia_sexualidade: "",
  fora_escola: "",
  amigos: "",
  amizade: "",
  fala_sozinho: "Nao",
  faz_de_conta: "Nao",
  imita_animais: "Nao",
  imita_pessoas: "Nao",
  veste_sozinho: "Nao",
  se_penteia: "Nao",
  banho_sozinho: "Nao",
  escova_dentes: "Nao",
  faz_laco: "Nao",
  arruma_pertences: "Nao",
  deficiencias_fisicas: "",
  deficiencias_mentais: "",
  alcoolismo: "",
  historico_suicidio: "",
  historico_alergia: "",
  luto_familia: "",
  conflitos_familiares: "Nao",
  quais_conflitos: "",
  historico_dinamica_familiar: "",
  crises_birras: "",
  com_quem_fica: "",
  comportamento_fuga_agressividade: "",
  ajuda_tarefas: "Nao",
  quais_tarefas: "",
  serie_atual: "",
  reprovacao: "",
  area_dificuldade: "",
  local_professor: "Nao",
  suporte_escolar: "",
  comportamento_escolar: "",
  habitos_lazer: "",
  rede_apoio: "",
  observacoes: ""
};

function Anamnese() {
  const navigate = useNavigate();
  const { ficha } = useParams(); // Valor da URL
  const { token, user } = useContext(AuthContext);
  const totalSteps = 17;
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Sempre que houver o parâmetro "ficha", atribuir a assistido_id (se não estiver definido)
  useEffect(() => {
    if (ficha && !formData.assistido_id) {
      setFormData((prev) => ({ ...prev, assistido_id: ficha }));
    }
  }, [ficha]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Remova essas linhas abaixo!
      // assistido_id: name === "de_menor" && value === "nao" ? "" : prev.assistido_id,
      // parentesco: name === "de_menor" && value === "nao" ? "" : prev.parentesco,
    }));
  };

  const removeMask = (value) => {
    return value.replace(/\D/g, "");
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
      const dataToSend = {
        ...formData,
        executado_por: user.id,
      };
  
      const response = await fetch("http://localhost:5000/api/anamnese", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (response.ok) {
        mostrarSucesso("Sucesso", "Anamnese cadastrada com sucesso!");
        setTimeout(() => navigate("/home"), 1500);
      } else {
        const errorData = await response.json();
        mostrarErro("Erro", errorData.message || "Erro ao salvar cadastro.");
      }
    } catch (error) {
      console.error("Erro em handleSubmit:", error);
      mostrarErro("Erro", "Erro ao salvar cadastro.");
    }
  };
  
  

  // Fetch dos dados do assistido para preencher a ficha, se aplicável
  useEffect(() => {
    const fetchAssistido = async () => {
      const response = await fetch(`http://localhost:5000/api/assistidos/${ficha}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
  
      setFormData((prev) => ({
        ...prev,
        assistido_id: ficha,
        nome: data.nome,
        nascimento: data.nascimento,
        // apenas os que fazem parte da tabela anamnese
      }));
    };
  
    if (ficha) fetchAssistido();
  }, [ficha, token]);
  

  // Função para calcular idade em anos e meses
  const calculateAge = (birthDateString) => {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();

    if (today.getDate() < birthDate.getDate()) {
      months--;
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    return { years, months };
  };

  // Atualiza o campo "idade" sempre que "nascimento" mudar
  useEffect(() => {
    if (formData.nascimento) {
      const { years, months } = calculateAge(formData.nascimento);
      setFormData((prev) => ({
        ...prev,
        idade: `${years} anos e ${months} meses`,
      }));
    }
  }, [formData.nascimento]);

  // Definição para a Etapa 17: Marcos do Desenvolvimento
  const marcos = [
    "Canta uma música inteira",
    "Canta partes de uma música",
    "Dança acompanhando as batidas da música",
    "Dança acompanhando alguém",
    "Percebe a localização do seu corpo no ambiente",
    "Percebe a localização de outros corpos em relação ao seu",
    "Identifica roteiros a ser seguidos assinalando entradas, saídas e alguns pontos de referência",
  ];
  const [marcosDesenvolvimento, setMarcosDesenvolvimento] = useState(
    Array(marcos.length).fill(null)
  );
  const handleMarcosSelection = (index, value) => {
    const newMarcos = [...marcosDesenvolvimento];
    newMarcos[index] = value;
    setMarcosDesenvolvimento(newMarcos);
  };

  return (
    <div className="cadastro-container">
      <div className="title-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ⬅ Sair
        </button>
        <h1>Anamnese</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Etapa 1: Dados de Identificação */}
        {currentStep === 1 && (
          <fieldset>
            <legend>Dados de Identificação</legend>
            <div className="form-grid2">
              <div className="form-group">
                <label>Nome Completo</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Ficha</label>
                <input
                  type="number"
                  name="assistido_id"
                  value={formData.assistido_id}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Data de Nascimento</label>
                <input
                  type="date"
                  name="nascimento"
                  value={formData.nascimento}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Idade</label>
                <input
                  type="text"
                  name="idade"
                  value={formData.idade || ""}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label>Série</label>
                <input
                  type="text"
                  name="serie"
                  value={formData.serie || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Turno</label>
                <input
                  type="text"
                  name="turno"
                  value={formData.turno || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Nome do Responsável 1</label>
                <input
                  type="text"
                  name="responsavel1"
                  value={formData.responsavel1 || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Idade do Responsável 1</label>
                <input
                  type="number"
                  name="idade_responsavel1"
                  value={formData.idade_responsavel1 || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Profissão do Responsável 1</label>
                <input
                  type="text"
                  name="profissao_responsavel1"
                  value={formData.profissao_responsavel1 || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Endereço da Residência 1</label>
                <input
                  type="text"
                  name="endereco_residencia1"
                  value={formData.endereco_residencia1 || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Contato Responsável 1</label>
                <InputMask
                  mask="(99) 99999-9999"
                  type="text"
                  name="contato1"
                  value={formData.contato1 || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Religião do Responsável 1</label>
                <input
                  type="text"
                  name="religiao1"
                  value={formData.religiao1 || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Nome do Responsável 2</label>
                <input
                  type="text"
                  name="responsavel2"
                  value={formData.responsavel2 || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Idade do Responsável 2</label>
                <input
                  type="number"
                  name="idade_responsavel2"
                  value={formData.idade_responsavel2 || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Endereço da Residência 2</label>
                <input
                  type="text"
                  name="endereco_residencia2"
                  value={formData.endereco_residencia2 || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Contato Responsável 2</label>
                <InputMask
                  mask="(99) 99999-9999"
                  type="text"
                  name="contato2"
                  value={formData.contato2 || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Religião do Responsável 2</label>
                <input
                  type="text"
                  name="religiao2"
                  value={formData.religiao2 || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>A guarda está em nome de:</label>
                <input
                  type="text"
                  name="guarda"
                  value={formData.guarda || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </fieldset>
        )}

        {/* Etapa 2: Queixa Principal */}
        {currentStep === 2 && (
          <fieldset>
            <legend>Queixa Principal</legend>
            <div className="form-group">
              <label>Histórico Clínico</label>
              <input
                type="text"
                name="historico"
                value={formData.historico || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Medicamentos</label>
              <select
                name="medicamentos"
                value={formData.medicamentos || "Nao"}
                onChange={handleChange}
              >
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>
              {formData.medicamentos === "Sim" && (
                <div className="form-group">
                  <label>Quais?</label>
                  <input
                    type="text"
                    name="quais_medicamentos"
                    value={formData.quais_medicamentos || ""}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Casos de internação</label>
              <input
                type="text"
                name="internacao"
                value={formData.internacao || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Psicoterapia/fono/fisio/neuro/psiquiatra</label>
              <input
                type="text"
                name="psico"
                value={formData.psico || ""}
                onChange={handleChange}
              />
            </div>
          </fieldset>
        )}

        {/* Etapa 3: Gestação e Nascimento */}
        {currentStep === 3 && (
          <fieldset>
            <legend>Sobre a Gestação e Nascimento</legend>
            <div className="form-group">
              <label>Foi Planejada?</label>
              <select
                name="planejada"
                value={formData.planejada || "nao"}
                onChange={handleChange}
              >
                <option value="nao">Não</option>
                <option value="sim">Sim</option>
              </select>
            </div>
            <div className="form-group">
              <label>Cesária ou Normal?</label>
              <select
                name="cesaria"
                value={formData.cesaria || "normal"}
                onChange={handleChange}
              >
                <option value="cesaria">Cesária</option>
                <option value="normal">Normal</option>
              </select>
            </div>
            <div className="form-group">
              <label>Pré Natal</label>
              <select
                name="pre_natal"
                value={formData.pre_natal || "sim"}
                onChange={handleChange}
              >
                <option value="sim">Sim</option>
                <option value="nao">Nao</option>
              </select>
            </div>
            <div className="form-group">
              <label>Drogas ou Alcool na Gestação</label>
              <select
                name="post_natal"
                value={formData.post_natal || "nao"}
                onChange={handleChange}
              >
                <option value="sim">Sim</option>
                <option value="nao">Nao</option>
              </select>
            </div>
            <div className="form-group">
              <label>Algum uso de Medicamentos</label>
              <select
                name="medicamentos_gestacao"
                value={formData.medicamentos_gestacao || "nao"}
                onChange={handleChange}
              >
                <option value="nao">Nao</option>
                <option value="sim">Sim</option>
              </select>
              {formData.medicamentos_gestacao === "sim" && (
                <div className="form-group">
                  <label>Quais?</label>
                  <input
                    type="text"
                    name="quais_medicamentos_gestacao"
                    value={formData.quais_medicamentos_gestacao || ""}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Algum evento significativo?</label>
              <input
                type="text"
                name="evento"
                value={formData.evento || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Quantas semanas de gestação ao nascer?</label>
              <input
                type="number"
                name="semanas"
                value={formData.semanas || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Nota de Apgar?</label>
              <input
                type="text"
                name="apgar"
                value={formData.apgar || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Como foi o processo de amamentação e desmame?</label>
              <input
                type="text"
                name="amamentacao"
                value={formData.amamentacao || ""}
                onChange={handleChange}
              />
            </div>
          </fieldset>
        )}

        {/* Etapa 4: Desenvolvimento Psicomotor */}
        {currentStep === 4 && (
          <fieldset>
            <legend>Desenvolvimento Psicomotor</legend>
            <div className="form-group">
              <label>Quando sustentou a cabeça?</label>
              <input
                type="text"
                name="sustentou"
                value={formData.sustentou || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Quando sentou sozinho?</label>
              <input
                type="text"
                name="sentou"
                value={formData.sentou || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Quando engatinhou?</label>
              <input
                type="text"
                name="engatinhar"
                value={formData.engatinhar || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Quando andou?</label>
              <input
                type="text"
                name="andou"
                value={formData.andou || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Desfraulde?</label>
              <input
                type="text"
                name="desfraulde"
                value={formData.desfraulde || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Controla evacuação-micção?</label>
              <select
                name="evacuacao"
                value={formData.evacuacao || "sim"}
                onChange={handleChange}
              >
                <option value="sim">Sim</option>
                <option value="nao">Nao</option>
              </select>
            </div>
          </fieldset>
        )}

        {/* Etapa 5: Linguagem */}
        {currentStep === 5 && (
          <fieldset>
            <legend>Linguagem</legend>
            <div className="form-group">
              <label>Quando iniciou a fala?</label>
              <input
                type="text"
                name="iniciou_fala"
                value={formData.iniciou_fala || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Apresenta dificuldade?</label>
              <select
                name="dificuldade"
                value={formData.dificuldade || "Nao"}
                onChange={handleChange}
              >
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>
              {formData.dificuldade === "Sim" && (
                <div className="form-group">
                  <label>Quais?</label>
                  <input
                    type="text"
                    name="quais_linguagem"
                    value={formData.quais_linguagem || ""}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Tem boa compreensão verbal?</label>
              <select
                name="compreensao_verbal"
                value={formData.compreensao_verbal || "sim"}
                onChange={handleChange}
              >
                <option value="sim">Sim</option>
                <option value="nao">Nao</option>
              </select>
            </div>
            <div className="form-group">
              <label>Comunica-se de forma verbal ou não verbal?</label>
              <select
                name="comunica_verbal"
                value={formData.comunica_verbal || "sim"}
                onChange={handleChange}
              >
                <option value="sim">Sim</option>
                <option value="nao">Nao</option>
              </select>
            </div>
            <div className="form-group">
              <label>Comunica-se através da escrita?</label>
              <input
                type="text"
                name="escrita"
                value={formData.escrita || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Consegue seguir comandos (simples e complexos)?</label>
              <input
                type="text"
                name="comandos"
                value={formData.comandos || ""}
                onChange={handleChange}
              />
            </div>
          </fieldset>
        )}

        {/* Etapa 6: Hábitos Alimentares */}
        {currentStep === 6 && (
          <fieldset>
            <legend>Hábitos Alimentares</legend>
            <div className="form-group">
              <label>Refeições por dia</label>
              <input
                type="number"
                name="refeicoes_por_dia"
                value={formData.refeicoes_por_dia || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Dificuldade com algum alimento ou seletividade alimentar?</label>
              <input
                type="text"
                name="dificuldade_alimentar"
                value={formData.dificuldade_alimentar || ""}
                onChange={handleChange}
              />
            </div>
          </fieldset>
        )}

        {/* Etapa 7: Dados sobre o Sono */}
        {currentStep === 7 && (
          <fieldset>
            <legend>Dados sobre o Sono</legend>
            <div className="form-group">
              <label>Como é o sono?</label>
              <input
                type="text"
                name="como_e_sono"
                value={formData.como_e_sono || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Teve alguma alteração de sono significativo em alguma outra fase da vida?</label>
              <input
                type="text"
                name="alteracao_sono"
                value={formData.alteracao_sono || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Divide quarto ou cama com alguém?</label>
              <input
                type="text"
                name="divide_cama"
                value={formData.divide_cama || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Tem algum hábito ou rotina noturna?</label>
              <input
                type="text"
                name="rotina_noturna"
                value={formData.rotina_noturna || ""}
                onChange={handleChange}
              />
            </div>
          </fieldset>
        )}

        {/* Etapa 8: Dados sobre a Saúde */}
        {currentStep === 8 && (
          <fieldset>
            <legend>Dados sobre a Saúde</legend>
            <div className="form-group">
              <label>Casos de convulsões, epilepsia, desmaios etc?</label>
              <input
                type="text"
                name="casos_saude"
                value={formData.casos_saude || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Alergias?</label>
              <select
                name="alergias"
                value={formData.alergias || "Nao"}
                onChange={handleChange}
              >
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>
              {formData.alergias === "Sim" && (
                <div className="form-group">
                  <label>Quais?</label>
                  <input
                    type="text"
                    name="quais_alergias"
                    value={formData.quais_alergias || ""}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Tomou todas as vacinas?</label>
              <input
                type="text"
                name="vacinas"
                value={formData.vacinas || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Já fez exames específicos?</label>
              <input
                type="text"
                name="maior_dificuldade"
                value={formData.maior_dificuldade || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <fieldset>
                <legend>Dificuldades</legend>
                <label>Visão</label>
                <select
                  name="visao"
                  value={formData.visao || "Nao"}
                  onChange={handleChange}
                >
                  <option value="Nao">Nao</option>
                  <option value="Sim">Sim</option>
                </select>
                <label>Audição</label>
                <select
                  name="audicao"
                  value={formData.audicao || "Nao"}
                  onChange={handleChange}
                >
                  <option value="Nao">Nao</option>
                  <option value="Sim">Sim</option>
                </select>
              </fieldset>
            </div>
          </fieldset>
        )}

        {/* Etapa 9: Manipulação e Hábitos */}
        {currentStep === 9 && (
          <fieldset>
            <legend>Manipulação e Hábitos</legend>
            <div className="form-group">
              <label>Usou chupeta?</label>
              <select
                name="chupeta"
                value={formData.chupeta || "Nao"}
                onChange={handleChange}
              >
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>
              {formData.chupeta === "Sim" && (
                <div className="form-group">
                  <label>Até quando?</label>
                  <input
                    type="text"
                    name="ate_quando_chupeta"
                    value={formData.ate_quando_chupeta || ""}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Roeu as unhas?</label>
              <select
                name="unhas"
                value={formData.unhas || "Nao"}
                onChange={handleChange}
              >
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>
              {formData.unhas === "Sim" && (
                <div className="form-group">
                  <label>Até quando?</label>
                  <input
                    type="text"
                    name="ate_quando_unhas"
                    value={formData.ate_quando_unhas || ""}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Algum tique ou manias?</label>
              <select
                name="manias"
                value={formData.manias || "Nao"}
                onChange={handleChange}
              >
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>
              {formData.manias === "Sim" && (
                <div className="form-group">
                  <label>Até quando?</label>
                  <input
                    type="text"
                    name="quais_manias"
                    value={formData.quais_manias || ""}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Como reage a mudanças na rotina e nos hábitos?</label>
              <input
                type="text"
                name="mudanca_rotina"
                value={formData.mudanca_rotina || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Como lida com frustrações?</label>
              <input
                type="text"
                name="lida_frustracoes"
                value={formData.lida_frustracoes || ""}
                onChange={handleChange}
              />
            </div>
          </fieldset>
        )}

        {/* Etapa 10: Sexualidade */}
        {currentStep === 10 && (
          <fieldset>
            <legend>Sexualidade</legend>
            <div className="form-group">
              <label>Já demonstrou curiosidade sexual?</label>
              <select
                name="curiosidade_sexual"
                value={formData.curiosidade_sexual || "Nao"}
                onChange={handleChange}
              >
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>
            </div>
            <div className="form-group">
              <label>Apresenta atitudes com outras pessoas?</label>
              <input
                type="text"
                name="atitudes_sexuais"
                value={formData.atitudes_sexuais || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Atitude da família em relação à sexualidade?</label>
              <input
                type="text"
                name="familia_sexualidade"
                value={formData.familia_sexualidade || ""}
                onChange={handleChange}
              />
            </div>
          </fieldset>
        )}

        {/* Etapa 11: Dados sobre Sociabilidade */}
        {currentStep === 11 && (
          <fieldset>
            <legend>Dados sobre Sociabilidade</legend>
            <div className="form-group">
              <label>O que faz quando não está na escola/faculdade/trabalho?</label>
              <input
                type="text"
                name="fora_escola"
                value={formData.fora_escola || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Tem amigos? Brinca/sai sozinho ou acompanhado</label>
              <input
                type="text"
                name="amigos"
                value={formData.amigos || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Faz amizade facilmente? Interage com facilidade?</label>
              <input
                type="text"
                name="amizade"
                value={formData.amizade || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Fala sozinho?</label>
              <select
                name="fala_sozinho"
                value={formData.fala_sozinho || "Nao"}
                onChange={handleChange}
              >
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>
            </div>
            <div className="form-group">
              <label>Brinca de faz de conta?</label>
              <select
                name="faz_de_conta"
                value={formData.faz_de_conta || "Nao"}
                onChange={handleChange}
              >
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>
            </div>
            <div className="form-group">
              <label>Imita animais?</label>
              <select
                name="imita_animais"
                value={formData.imita_animais || "Nao"}
                onChange={handleChange}
              >
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>
            </div>
            <div className="form-group">
              <label>Imita pessoas?</label>
              <select
                name="imita_pessoas"
                value={formData.imita_pessoas || "Nao"}
                onChange={handleChange}
              >
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>
            </div>
          </fieldset>
        )}

        {/* Etapa 12: Vestuario/Higiene/Organizacao */}
        {currentStep === 12 && (
          <fieldset>
            <legend>Vestuário/Higiene/Organização</legend>
            <div className="form-group">
              <label>Se veste sozinho?</label>
              <select
                name="veste_sozinho"
                value={formData.veste_sozinho || "Nao"}
                onChange={handleChange}
              >
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>
            </div>
            <div className="form-group">
              <label>Se penteia?</label>
              <select
                name="se_penteia"
                value={formData.se_penteia || "Nao"}
                onChange={handleChange}
              >
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>
            </div>
            <div className="form-group">
              <label>Toma banho sozinho?</label>
              <select
                name="banho_sozinho"
                value={formData.banho_sozinho || "Nao"}
                onChange={handleChange}
              >
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>
            </div>
            <div className="form-group">
              <label>Escova os dentes?</label>
              <select
                name="escova_dentes"
                value={formData.escova_dentes || "Nao"}
                onChange={handleChange}
              >
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>
            </div>
            <div className="form-group">
              <label>Faz nós e laços?</label>
              <select
                name="faz_laco"
                value={formData.faz_laco || "Nao"}
                onChange={handleChange}
              >
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>
            </div>
            <div className="form-group">
              <label>Arruma seus materiais e seus pertences?</label>
              <select
                name="arruma_pertences"
                value={formData.arruma_pertences || "Nao"}
                onChange={handleChange}
              >
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>
            </div>
          </fieldset>
        )}

        {/* Etapa 13: Antecedentes Familiares */}
        {currentStep === 13 && (
          <fieldset>
            <legend>Antecedentes Familiares</legend>
            <div className="form-group">
              <label>Deficiências físicas?</label>
              <input
                type="text"
                name="deficiencias_fisicas"
                value={formData.deficiencias_fisicas || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Deficiências mentais ou outras?</label>
              <input
                type="text"
                name="deficiencias_mentais"
                value={formData.deficiencias_mentais || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Caso de alcoolismo?</label>
              <input
                type="text"
                name="alcoolismo"
                value={formData.alcoolismo || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Histórico de suicídio?</label>
              <input
                type="text"
                name="historico_suicidio"
                value={formData.historico_suicidio || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Alergia</label>
              <input
                type="text"
                name="historico_alergia"
                value={formData.historico_alergia || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Perda ou processo de luto na família</label>
              <input
                type="text"
                name="luto_familia"
                value={formData.luto_familia || ""}
                onChange={handleChange}
              />
            </div>
          </fieldset>
        )}

        {/* Etapa 14: Relacionamento Familiar */}
        {currentStep === 14 && (
          <fieldset>
            <legend>Relacionamento Familiar</legend>
            <div className="form-group">
              <label>Conflitos?</label>
              <select
                name="conflitos_familiares"
                value={formData.conflitos_familiares || "Nao"}
                onChange={handleChange}
              >
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>
              {formData.conflitos_familiares === "Sim" && (
                <div className="form-group">
                  <label>Quais?</label>
                  <input
                    type="text"
                    name="quais_conflitos"
                    value={formData.quais_conflitos || ""}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Histórico e dinâmica familiar?</label>
              <input
                type="text"
                name="historico_dinamica_familiar"
                value={formData.historico_dinamica_familiar || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Como lidam com crises e birras?</label>
              <input
                type="text"
                name="crises_birras"
                value={formData.crises_birras || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Com quem o paciente fica a maior parte do tempo?</label>
              <input
                type="text"
                name="com_quem_fica"
                value={formData.com_quem_fica || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Demonstra comportamento de fuga ou agressividade?</label>
              <input
                type="text"
                name="comportamento_fuga_agressividade"
                value={formData.comportamento_fuga_agressividade || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Ajuda nas tarefas?</label>
              <select
                name="ajuda_tarefas"
                value={formData.ajuda_tarefas || "Nao"}
                onChange={handleChange}
              >
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>
              {formData.ajuda_tarefas === "Sim" && (
                <div className="form-group">
                  <label>Quais?</label>
                  <input
                    type="text"
                    name="quais_tarefas"
                    value={formData.quais_tarefas || ""}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
          </fieldset>
        )}

        {/* Etapa 15: Escolaridade */}
        {currentStep === 15 && (
          <fieldset>
            <legend>Escolaridade</legend>
            <div className="form-group">
              <label>Série Atual?</label>
              <input
                type="text"
                name="serie_atual"
                value={formData.serie_atual || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Casos de reprovação?</label>
              <input
                type="text"
                name="reprovacao"
                value={formData.reprovacao || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Área de dificuldade?</label>
              <input
                type="text"
                name="area_dificuldade"
                value={formData.area_dificuldade || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Local tem professor de apoio ou mediador?</label>
              <select
                name="local_professor"
                value={formData.local_professor || "Nao"}
                onChange={handleChange}
              >
                <option value="Nao">Nao</option>
                <option value="Sim">Sim</option>
              </select>
            </div>
            <div className="form-group">
              <label>Paciente consegue fazer todas as tarefas ou necessita de suporte?</label>
              <input
                type="text"
                name="suporte_escolar"
                value={formData.suporte_escolar || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Como é o comportamento do paciente no local?</label>
              <input
                type="text"
                name="comportamento_escolar"
                value={formData.comportamento_escolar || ""}
                onChange={handleChange}
              />
            </div>
          </fieldset>
        )}

        {/* Etapa 16: Histórico Social */}
        {currentStep === 16 && (
          <fieldset>
            <legend>Histórico Social</legend>
            <div className="form-group">
              <label>Hábitos de lazer, inserção em grupos:</label>
              <input
                type="text"
                name="habitos_lazer"
                value={formData.habitos_lazer || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Rede de apoio:</label>
              <input
                type="text"
                name="rede_apoio"
                value={formData.rede_apoio || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Observações:</label>
              <input
                type="text"
                name="observacoes"
                value={formData.observacoes || ""}
                onChange={handleChange}
              />
            </div>
          </fieldset>
        )}

        {/* Etapa 17: Marcos do Desenvolvimento */}
        {currentStep === 17 && (
          <fieldset>
            <legend>Marcos do Desenvolvimento</legend>
            <table className="tabela">
              <thead>
                <tr>
                  <th>Marcos do Desenvolvimento</th>
                  <th>Consegue Fazer Sozinho</th>
                  <th>Consegue Fazer com Ajuda</th>
                  <th>Ainda Não Consegue Fazer</th>
                </tr>
              </thead>
              <tbody>
                {marcos.map((marco, index) => (
                  <tr key={index}>
                    <td>{marco}</td>
                    <td>
                      <input
                        type="radio"
                        name={`marco_${index}`}
                        value="sozinho"
                        checked={marcosDesenvolvimento[index] === "sozinho"}
                        onChange={() => handleMarcosSelection(index, "sozinho")}
                      />
                    </td>
                    <td>
                      <input
                        type="radio"
                        name={`marco_${index}`}
                        value="com_ajuda"
                        checked={marcosDesenvolvimento[index] === "com_ajuda"}
                        onChange={() => handleMarcosSelection(index, "com_ajuda")}
                      />
                    </td>
                    <td>
                      <input
                        type="radio"
                        name={`marco_${index}`}
                        value="nao_consegue"
                        checked={marcosDesenvolvimento[index] === "nao_consegue"}
                        onChange={() => handleMarcosSelection(index, "nao_consegue")}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </fieldset>
        )}

        {/* Botões de Navegação */}
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
                console.log("Step atual:", currentStep);
                handleNext();
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
