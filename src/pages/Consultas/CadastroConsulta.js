import React, { useState, useEffect, useContext } from "react";
import Select from "react-select"; // Biblioteca para selects pesquisáveis
import "../../assets/css/CadastroConsulta.css"; // Importando estilos
import { AuthContext } from "../../context/AuthContext"; // Pegando o Token do contexto

const ModalAdicionarConsulta = ({ onClose }) => {
  const { token } = useContext(AuthContext); // Obtendo o token de autenticação
  const [newEvent, setNewEvent] = useState({
    title: "",
    data_hora: "",
    tipo_consulta_id: "",
    ficha_assistido: "",
    voluntario_id: "",
  });

  const [tiposConsulta, setTiposConsulta] = useState([]);
  const [assistidos, setAssistidos] = useState([]);
  const [voluntarios, setVoluntarios] = useState([]);

  // 🚀 Buscar dados do backend ao abrir o modal
  useEffect(() => {
    if (!token) return; // Se não houver token, não faz a requisição

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const tiposResponse = await fetch("http://localhost:5000/api/tipos-consulta", { headers });
        const assistidosResponse = await fetch("http://localhost:5000/api/assistidos", { headers });
        const voluntariosResponse = await fetch("http://localhost:5000/api/voluntarios/buscar", { headers });

        const tiposData = await tiposResponse.json();
        const assistidosData = await assistidosResponse.json();
        const voluntariosData = await voluntariosResponse.json();

        // Formatando os dados para o react-select
        setTiposConsulta(tiposData.map(t => ({ value: t.id, label: t.nome })));
        setAssistidos(assistidosData.map(a => ({ value: a.ficha, label: `${a.ficha} - ${a.nome}` })));
        setVoluntarios(voluntariosData.map(v => ({ value: v.id, label: v.nome })));
      } catch (error) {
        console.error("❌ Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [token]); // O `useEffect` roda sempre que o `token` mudar

  // 📌 Salvar nova consulta no backend
  const handleAddEvent = async () => {
    if (!token) {
      alert("Usuário não autenticado.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/agendas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔐 Enviando o token na requisição
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        alert("Consulta adicionada com sucesso!");
        onClose(); // Fecha o modal após adicionar
      } else {
        console.error("Erro ao adicionar consulta");
      }
    } catch (error) {
      console.error("❌ Erro ao salvar consulta:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Adicionar Nova Consulta</h2>

        <label>Título da Consulta</label>
        <input
          type="text"
          placeholder="Digite um título para a consulta..."
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />

        <label>Nome do Paciente</label>
        <Select
          options={assistidos}
          onChange={(selectedOption) => setNewEvent({ ...newEvent, ficha_assistido: selectedOption.value })}
          placeholder="Selecione o paciente..."
          isSearchable
        />

        <label>Tipo de Consulta</label>
        <Select
          options={tiposConsulta}
          onChange={(selectedOption) => setNewEvent({ ...newEvent, tipo_consulta_id: selectedOption.value })}
          placeholder="Selecione o tipo de consulta..."
          isSearchable
        />

        <label>Voluntário</label>
        <Select
          options={voluntarios}
          onChange={(selectedOption) => setNewEvent({ ...newEvent, voluntario_id: selectedOption.value })}
          placeholder="Selecione o voluntário..."
          isSearchable
        />

        <label>Data e Hora</label>
        <input
          type="datetime-local"
          value={newEvent.data_hora}
          onChange={(e) => setNewEvent({ ...newEvent, data_hora: e.target.value })}
        />

        <button className="save-button" onClick={handleAddEvent}>Salvar</button>
        <button className="close-button" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default ModalAdicionarConsulta;
