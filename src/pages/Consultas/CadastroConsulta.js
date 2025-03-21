import React, { useState, useEffect, useContext } from "react";
import Select from "react-select"; // Select pesquisável
import "../../assets/css/CadastroConsulta.css"; // Estilos do modal
import { AuthContext } from "../../context/AuthContext"; // Pegando o Token do contexto
import { mostrarSucesso, mostrarErro } from "../../components/SweetAlert"; // SweetAlert para feedback

const ModalAdicionarConsulta = ({ onClose }) => {
  const { token } = useContext(AuthContext);
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

  // 🚀 Buscar dados ao abrir o modal
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [tiposRes, assistidosRes, voluntariosRes] = await Promise.all([
          fetch("http://localhost:5000/api/tipos-consulta", { headers }),
          fetch("http://localhost:5000/api/assistidos", { headers }),
          fetch("http://localhost:5000/api/voluntarios/buscar", { headers }),
        ]);

        const [tiposData, assistidosData, voluntariosData] = await Promise.all([
          tiposRes.json(),
          assistidosRes.json(),
          voluntariosRes.json(),
        ]);

        // Formatando os dados para o react-select
        setTiposConsulta(tiposData.map(t => ({ value: t.id, label: t.nome })));
        setAssistidos(assistidosData.map(a => ({ value: a.ficha, label: `${a.ficha} - ${a.nome}` })));
        setVoluntarios(voluntariosData.map(v => ({ value: v.id, label: v.nome })));
      } catch (error) {
        mostrarErro("Erro", "Falha ao carregar os dados.");
      }
    };

    fetchData();
  }, [token]);

  // 📌 Adicionar consulta
  const handleAddEvent = async () => {
    if (!token) {
      mostrarErro("Erro", "Usuário não autenticado.");
      return;
    }

    if (!newEvent.ficha_assistido || !newEvent.tipo_consulta_id || !newEvent.voluntario_id || !newEvent.data_hora) {
      mostrarErro("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/agendas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        mostrarSucesso("Sucesso", "Consulta adicionada com sucesso!");
        onClose(); // Fechar modal
      } else {
        mostrarErro("Erro", "Falha ao adicionar consulta.");
      }
    } catch (error) {
      mostrarErro("Erro", "Erro ao salvar consulta.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Adicionar Nova Consulta</h2>

        <label>Nome do Paciente</label>
        <Select
          options={assistidos}
          value={assistidos.find(a => a.value === newEvent.ficha_assistido)}
          onChange={(selectedOption) => setNewEvent({ ...newEvent, ficha_assistido: selectedOption.value })}
          placeholder="Selecione o paciente..."
          isSearchable
        />

        <label>Tipo de Consulta</label>
        <Select
          options={tiposConsulta}
          value={tiposConsulta.find(t => t.value === newEvent.tipo_consulta_id)}
          onChange={(selectedOption) => setNewEvent({ ...newEvent, tipo_consulta_id: selectedOption.value })}
          placeholder="Selecione o tipo de consulta..."
          isSearchable
        />

        <label>Voluntário</label>
        <Select
          options={voluntarios}
          value={voluntarios.find(v => v.value === newEvent.voluntario_id)}
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

        <button className="save-button" onClick={handleAddEvent}>
          Salvar
        </button>
        <button className="close-button" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ModalAdicionarConsulta;
