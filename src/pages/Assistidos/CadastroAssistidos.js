  import React, { useState, useContext } from "react";
  import { useNavigate } from "react-router-dom";
  import "../../assets/css/cadastroAssistidos.css";
  import { mostrarSucesso, mostrarErro } from "../../components/SweetAlert";
  import { AuthContext } from "../../context/AuthContext";
  import InputMask from "react-input-mask";

  function CadastroAssistidos() {
    const navigate = useNavigate();
    const { token, user } = useContext(AuthContext);
    const totalSteps = 4;
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
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
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
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
          const response = await fetch(
            `https://viacep.com.br/ws/${formData.cep}/json/`
          );
          const data = await response.json();
          if (!data.erro) {
            setFormData((prev) => ({
              ...prev,
              endereco: data.logradouro || "",
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


    

    const handleNext = () => {
      setCurrentStep((prev) => prev + 1);
    };

    const handlePrev = () => {
      setCurrentStep((prev) => prev - 1);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSuccessMessage("");
      try {
        const submissionData = new FormData();
        for (const key in formData) {
          submissionData.append(key, formData[key]);
        }
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

    return (
      < div className="cadastro-container">
       <div className="title-container">
           <button className="back-button" onClick={() => navigate(-1)}>⬅ Voltar</button>
           <h1>Cadastro de Assistidos</h1>
          </div>

        <form onSubmit={handleSubmit}>
          {/* 🔹 Etapa 1: Informações Pessoais */}
          {currentStep === 1 && (
            <fieldset>
              <legend>Informações Pessoais</legend>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nome Completo</label>
                  <input type="text" name="nome" value={formData.nome} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>CPF</label>
                  <InputMask mask="999-999-999-99" type="text" name="cpf" value={formData.cpf} onChange={handleChange}  />
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
                  <label>E-mail</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
              </div>
            </fieldset>
          )}

          {/* 🔹 Etapa 2: Endereço */}
          {currentStep === 2 && (
            <fieldset>
              <legend>Endereço</legend>
              <div className="form-grid">
                <div className="form-group">
                  <label>CEP</label>
                  <input type="text" name="cep" value={formData.cep} onChange={handleChange} onBlur={fetchCEP} />
                </div>
                <div className="form-group">
                  <label>Rua</label>
                  <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} readOnly />
                </div>
                <div className="form-group">
                  <label>Número</label>
                  <input type="text" name="numero" value={formData.numero} onChange={handleChange} />
                </div>
              </div>
            </fieldset>
          )}

          {/* 🔹 Etapa 3: Situação Social */}
          {currentStep === 3 && (
            <fieldset>
              <legend>Situação Social</legend>
              <div className="form-group">
                <label>Recebe cesta básica?</label>
                <select name="cesta_basica" value={formData.cesta_basica} onChange={handleChange}>
                  <option value="nao">Não</option>
                  <option value="sim">Sim</option>
                </select>
              </div>
            </fieldset>
          )}

          {/* 🔹 Etapa 4: Anexos */}
          {currentStep === 4 && (
            <fieldset>
              <legend>Anexos</legend>
              <div className="form-group">
                <label>Documento de Identidade</label>
                <input type="file" name="anexo_id" onChange={handleFileChange} />
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
              <button type="button" className="next" onClick={handleNext}>
                Próximo
              </button>
            ) : (
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
