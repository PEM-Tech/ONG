import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../assets/css/cadastroVoluntarios.css";
import { mostrarSucesso, mostrarErro } from "../../components/SweetAlert";
import { AuthContext } from "../../context/AuthContext";
import InputMask from "react-input-mask";

function EditVoluntarios() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token, user } = useContext(AuthContext);
  const totalSteps = 3;
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
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
    anexo_id: null,
  });

  const [errors, setErrors] = useState({});

  // Carrega os dados atuais do voluntário
  useEffect(() => {
    const fetchVoluntario = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/voluntarios/buscar/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setFormData({
            nome: data.nome || "",
            cpf: data.cpf || "",
            nascimento: data.nascimento || "",
            genero: data.genero || "",
            celular: data.celular || "",
            email: data.email || "",
            cep: data.cep || "",
            rua: data.rua || "",
            numero: data.numero || "",
            bairro: data.bairro || "",
            cidade: data.cidade || "",
            estado: data.estado || "",
            anexo_id: data.anexo_id || null,
          });
        } else {
          mostrarErro("Erro", "Não foi possível carregar os dados do voluntário.");
        }
      } catch (error) {
        mostrarErro("Erro", "Erro ao carregar os dados do voluntário.");
      }
    };

    fetchVoluntario();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  // Função para remover caracteres especiais da máscara (CPF, celular e CEP)
  const removeMask = (value) => {
    return value.replace(/\D/g, ""); // Remove tudo que não for número
  };

  // Buscar CEP automaticamente
  const fetchCEP = async () => {
    const cepLimpo = removeMask(formData.cep);
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
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

  // Enviar os dados atualizados
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submissionData = new FormData();
      for (const key in formData) {
        submissionData.append(key, formData[key]);
      }
      // Remover a máscara
      submissionData.set("cpf", removeMask(formData.cpf));
      submissionData.set("celular", removeMask(formData.celular));
      submissionData.set("cep", removeMask(formData.cep));
      submissionData.append("executado_por", user.id);

      const response = await fetch(`http://localhost:5000/api/voluntarios/atualizar/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submissionData,
      });

      if (response.ok) {
        mostrarSucesso("Sucesso", "Voluntário atualizado com sucesso!");
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else {
        mostrarErro("Erro", "Erro ao atualizar cadastro.");
      }
    } catch (error) {
      mostrarErro("Erro", "Erro ao atualizar cadastro.");
    }
  };

  return (
    <div className="cadastro-container">
      <div className="title-container">
        <button className="back-button" onClick={() => navigate(-1)}>⬅ Sair</button>
        <h1>Editar Voluntário</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <fieldset>
            <legend>Dados do Voluntário</legend>
            <div className="form-grid">
              <div className="form-group">
                <label>Nome Completo</label>
                <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>CPF</label>
                <InputMask
                  mask="999.999.999-99"
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Data de Nascimento</label>
                <input type="date" name="nascimento" value={formData.nascimento} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Gênero</label>
                <select name="genero" value={formData.genero} onChange={handleChange} required>
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
                  required
                />
              </div>
              <div className="form-group">
                <label>E-mail</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>
          </fieldset>
        )}

        {currentStep === 2 && (
          <fieldset>
            <legend>Endereço</legend>
            <div className="form-grid">
              <div className="form-group">
                <label>CEP</label>
                <InputMask
                  mask="99999-999"
                  type="text"
                  name="cep"
                  value={formData.cep}
                  onChange={handleChange}
                  onBlur={fetchCEP}
                  required
                />
              </div>
              <div className="form-group">
                <label>Rua</label>
                <input type="text" name="rua" value={formData.rua} onChange={handleChange} readOnly />
              </div>
              <div className="form-group">
                <label>Número</label>
                <input type="text" name="numero" value={formData.numero} onChange={handleChange} required />
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
            </div>
          </fieldset>
        )}

        {currentStep === 3 && (
          <fieldset>
            <legend>Anexos</legend>
            <div className="form-group">
              <label>Documento de Identidade</label>
              <input type="file" name="anexo_id" onChange={handleFileChange} />
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

export default EditVoluntarios;
