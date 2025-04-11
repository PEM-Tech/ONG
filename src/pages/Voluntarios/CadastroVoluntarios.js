import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/cadastroVoluntarios.css";
import { mostrarSucesso, mostrarErro } from "../../components/SweetAlert";
import { AuthContext } from "../../context/AuthContext";
import InputMask from "react-input-mask";
import { fetchAddressByCep } from "../../services/cepService";
import { removeMask } from "../../services/utils";

function CadastroVoluntarios() {
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  const totalSteps = 3;

  const [currentStep, setCurrentStep] = useState(1);
  const [categorias, setCategorias] = useState([]);

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
    categoria_id: "",
    anexo_id: null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categorias", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCategorias(data);
      } catch (error) {
        console.error("Erro ao carregar categorias", error);
      }
    };
    carregarCategorias();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handlePrev = () => setCurrentStep((prev) => prev - 1);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleCEP = async () => {
    try {
      const addressData = await fetchAddressByCep(formData.cep);
      setFormData((prev) => ({
        ...prev,
        rua: addressData.endereco || "Não informado",
        bairro: addressData.bairro || "Não informado",
        cidade: addressData.cidade || "Não informado",
        estado: addressData.estado || "Não informado",
      }));
      setErrors((prev) => ({ ...prev, cep: "" }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, cep: error.message }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submissionData = new FormData();
      for (const key in formData) {
        submissionData.append(key, formData[key]);
      }

      submissionData.set("cpf", removeMask(formData.cpf));
      submissionData.set("celular", removeMask(formData.celular));
      submissionData.set("cep", removeMask(formData.cep));
      submissionData.append("executado_por", user.id);

      const response = await fetch("http://localhost:5000/api/voluntarios/criar", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: submissionData,
      });

      if (response.ok) {
        mostrarSucesso("Sucesso", "Voluntário cadastrado com sucesso!");
        setTimeout(() => navigate("/listarVoluntarios"), 1500);
      } else {
        mostrarErro("Erro", "Erro ao salvar cadastro.");
      }
    } catch (error) {
      mostrarErro("Erro", "Erro ao salvar cadastro.");
    }
  };

  return (
    <div className="cadastro-container">
      <div className="title-container">
        <button className="back-button" onClick={() => navigate(-1)}>⬅ Sair</button>
        <h1>Cadastro de Voluntários</h1>
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
                <InputMask mask="999.999.999-99" name="cpf" value={formData.cpf} onChange={handleChange} required />
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
                <label>Categoria</label>
                <select name="categoria_id" value={formData.categoria_id} onChange={handleChange} required>
                  <option value="">Selecione</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Celular</label>
                <InputMask mask="(99) 99999-9999" name="celular" value={formData.celular} onChange={handleChange} required />
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
                <InputMask mask="99999-999" name="cep" value={formData.cep} onChange={handleChange} onBlur={handleCEP} required />
              </div>
              <div className="form-group">
                <label>Rua</label>
                <input type="text" name="rua" value={formData.rua} readOnly />
              </div>
              <div className="form-group">
                <label>Número</label>
                <input type="text" name="numero" value={formData.numero} onChange={handleChange} required />
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
            <button type="button" className="prev" onClick={handlePrev}>Voltar</button>
          )}

          {currentStep < totalSteps ? (
            <button type="button" className="next" onClick={handleNext}>Próximo</button>
          ) : (
            <button type="submit" className="submit">Cadastrar</button>
          )}
        </div>
      </form>
    </div>
  );
}

export default CadastroVoluntarios;