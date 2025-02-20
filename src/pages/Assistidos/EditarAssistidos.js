import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../assets/css/cadastroAssistidos.css";
import { mostrarSucesso, mostrarErro } from "../../components/SweetAlert";
import { AuthContext } from "../../context/AuthContext";
import InputMask from "react-input-mask";

function EditarAssistido() {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const totalSteps = 4;
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
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
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar assistido:", error);
        mostrarErro("Erro", "Não foi possível carregar os dados do assistido.");
        setLoading(false);
      }
    };

    fetchAssistido();
  }, [id, token]);

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

      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Informações Pessoais</legend>
          <input type="text" name="nome" value={formData.nome} onChange={handleChange} />
          <InputMask mask="999.999.999-99" type="text" name="cpf" value={formData.cpf} onChange={handleChange} />
          <input type="date" name="nascimento" value={formData.nascimento} onChange={handleChange} />
          <input type="text" name="celular" value={formData.celular} onChange={handleChange} />
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </fieldset>

        <fieldset>
          <legend>Endereço</legend>
          <InputMask mask="99999-999" type="text" name="cep" value={formData.cep} onChange={handleChange} onBlur={fetchCEP} />
          <input type="text" name="rua" value={formData.rua} readOnly />
          <input type="text" name="numero" value={formData.numero} onChange={handleChange} />
          <input type="text" name="bairro" value={formData.bairro} readOnly />
        </fieldset>

        <fieldset>
          <legend>Documentos</legend>
          <input type="file" name="anexo_id" onChange={handleFileChange} />
          <input type="file" name="anexo2_id" onChange={handleFileChange} />
          <input type="file" name="anexo3_id" onChange={handleFileChange} />
        </fieldset>

        <button type="submit" className="submit">Atualizar</button>
        <button type="button" className="cancel" onClick={() => navigate(-1)}>Cancelar</button>
      </form>
    </div>
  );
}

export default EditarAssistido;
