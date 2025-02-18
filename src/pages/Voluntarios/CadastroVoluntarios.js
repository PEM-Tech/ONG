import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/cadastroVoluntarios.css";
import { mostrarSucesso, mostrarErro } from "../../components/SweetAlert";
import { AuthContext } from "../../context/AuthContext";
import InputMask from "react-input-mask";

function CadastroVoluntarios() {
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);

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
    agenda: "",
    anexo_id: null,
  });

  const [errors, setErrors] = useState({});

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

  // 🔹 Função para remover caracteres especiais da máscara (CPF, celular e CEP)
  const removeMask = (value) => {
    return value.replace(/\D/g, ""); // Remove tudo que não for número
  };

  // 🔹 Buscar CEP automaticamente
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

  // 🔹 Enviar os dados do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submissionData = new FormData();
      for (const key in formData) {
        submissionData.append(key, formData[key]);
      }

      // 🛠 Removendo a máscara antes de enviar os dados
      submissionData.set("cpf", removeMask(formData.cpf));
      submissionData.set("celular", removeMask(formData.celular));
      submissionData.set("cep", removeMask(formData.cep));
      submissionData.append("executado_por", user.id);

      const response = await fetch("http://localhost:5000/api/voluntarios", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submissionData,
      });

      if (response.ok) {
        mostrarSucesso("Sucesso", "Voluntário cadastrado com sucesso!");
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
    <div className="cadastro-container">
      <div className="title-container">
        <button className="back-button" onClick={() => navigate(-1)}>⬅ Voltar</button>
        <h1>Cadastro de Voluntários</h1>
      </div>

      <form onSubmit={handleSubmit}>
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

        <fieldset>
          <legend>Anexos</legend>
          <div className="form-group">
            <label>Documento de Identidade</label>
            <input type="file" name="anexo_id" onChange={handleFileChange} />
          </div>
        </fieldset>

        <div className="buttons">
          <button type="submit" className="submit">Cadastrar</button>
        </div>
      </form>
    </div>
  );
}

export default CadastroVoluntarios;
