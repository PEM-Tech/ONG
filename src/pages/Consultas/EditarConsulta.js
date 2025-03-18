import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import "../../assets/css/EditarConsulta.css";
import { AuthContext } from "../../context/AuthContext";

const ModalEditarConsulta = ({ event, onClose }) => {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    id: event.id,
    title: event.title,
    data_hora: new Date(event.start).toISOString().slice(0, 16),
    tipo_consulta_id: "",
    ficha_assistido: "",
    voluntario_id: "",
  });

  const [tiposConsulta, setTiposConsulta] = useState([]);
  const [assistidos, setAssistidos] = useState([]);
  const [voluntarios, setVoluntarios] = useState([]);

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

        setTiposConsulta(tiposData.map(t => ({ value: t.id, label: t.nome })));
        setAssistidos(assistidosData.map(a => ({ value: a.ficha, label: `${a.ficha} - ${a.nome}` })));
        setVoluntarios(voluntariosData.map(v => ({ value: v.id, label: v.nome })));
      } catch (error) {
        console.error("❌ Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [token]);

  // 📌 Atualizar consulta no backend
  const handleUpdate = async () => {
    if (!token) return alert("Usuário não autenticado.");

    try {
      const response = await fetch(`http://localhost:5000/api/agendas/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erro ao atualizar consulta");

      alert("Consulta atualizada com sucesso!");
      onClose();
    } catch (error) {
      console.error("❌ Erro ao salvar consulta:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Consulta</h2>

        <label>Título</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <label>Data e Hora</label>
        <input
          type="datetime-local"
          value={formData.data_hora}
          onChange={(e) => setFormData({ ...formData, data_hora: e.target.value })}
        />

        <label>Nome do Paciente</label>
        <Select
          options={assistidos}
          value={assistidos.find(a => a.value === formData.ficha_assistido)}
          onChange={(selectedOption) => setFormData({ ...formData, ficha_assistido: selectedOption.value })}
          isSearchable
        />

        <label>Tipo de Consulta</label>
        <Select
          options={tiposConsulta}
          value={tiposConsulta.find(t => t.value === formData.tipo_consulta_id)}
          onChange={(selectedOption) => setFormData({ ...formData, tipo_consulta_id: selectedOption.value })}
          isSearchable
        />

        <label>Voluntário</label>
        <Select
          options={voluntarios}
          value={voluntarios.find(v => v.value === formData.voluntario_id)}
          onChange={(selectedOption) => setFormData({ ...formData, voluntario_id: selectedOption.value })}
          isSearchable
        />

        <button className="save-button" onClick={handleUpdate}>Salvar Alterações</button>
        <button className="close-button" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default ModalEditarConsulta;
