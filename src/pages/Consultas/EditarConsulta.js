import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import "moment/locale/pt-br";
import "../../assets/css/EditarConsulta.css";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";

moment.locale("pt-br");

const ModalEditarConsulta = ({ event, onClose }) => {
  const { token } = useContext(AuthContext);
  const [tiposConsulta, setTiposConsulta] = useState([]);
  const [assistidos, setAssistidos] = useState([]);
  const [voluntarios, setVoluntarios] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // 📌 Estado inicial do formulário (Preenchido após os dados carregarem)
  const [formData, setFormData] = useState({
    id: event.id,
    title: event.title,
    data_hora: moment(event.start).utcOffset(0, true).format("YYYY-MM-DDTHH:mm"),
    tipo_consulta_id: "",
    ficha_assistido: "",
    voluntario_id: "",
  });

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

        setTiposConsulta(tiposData);
        setAssistidos(assistidosData);
        setVoluntarios(voluntariosData);

        // ✅ Preencher os selects com os valores corretos
        setFormData({
          id: event.id,
          title: event.title,
          data_hora: moment(event.start).utcOffset(0, true).format("YYYY-MM-DDTHH:mm"),
          tipo_consulta_id: event.tipo_consulta_id || tiposData[0]?.id || "",
          ficha_assistido: event.ficha_assistido || assistidosData[0]?.ficha || "",
          voluntario_id: event.voluntario_id || voluntariosData[0]?.id || "",
        });

        setIsDataLoaded(true); // ✅ Marca que os dados já foram carregados
      } catch (error) {
        console.error("❌ Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [token, event]); // 🔄 Atualiza se `event` mudar


  const deletarConsulta = async (id, token, onSuccess) => {
    const confirmacao = await Swal.fire({
      title: "Tem certeza que deseja excluir esta consulta?",
      text: "Essa ação é irreversível.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar"
    });
  
    if (confirmacao.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5000/api/agendas/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Erro ao deletar a consulta.");
        }
  
        await Swal.fire("Excluído!", "A consulta foi removida com sucesso.", "success");
  
        if (typeof onSuccess === "function") onSuccess(); // callback se precisar atualizar a lista
        onClose(); // fecha o modal
  
      } catch (error) {
        console.error("Erro ao excluir consulta:", error);
        Swal.fire("Erro!", error.message || "Erro ao excluir consulta.", "error");
      }
    } else {
      // Usuário cancelou a exclusão — não faz nada.
      console.log("Exclusão cancelada pelo usuário.");
    }
  };
  


  // 📌 Atualizar consulta no backend
  const handleUpdate = async () => {
    if (!token) return alert("Usuário não autenticado.");

    const updatedFormData = {
      ...formData,
      data_hora: moment(formData.data_hora).utc().format("YYYY-MM-DD HH:mm:ss"), // Converte para UTC antes de enviar
    };

    try {
      const response = await fetch(`http://localhost:5000/api/agendas/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFormData),
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

        {/* 🔹 Verifica se os dados já foram carregados antes de exibir os selects */}
        {isDataLoaded ? (
          <>
            <label>Nome do Paciente</label>
            <select className="select-agenda"
              value={formData.ficha_assistido}
              onChange={(e) => setFormData({ ...formData, ficha_assistido: e.target.value })}
            >
              <option value="">Selecione um paciente</option>
              {assistidos.map((a) => (
                <option key={a.ficha} value={a.ficha}>
                  {a.ficha} - {a.nome}
                </option>
              ))}
            </select>

            <label>Tipo de Consulta</label>
            <select className="select-agenda"
              value={formData.tipo_consulta_id}
              onChange={(e) => setFormData({ ...formData, tipo_consulta_id: e.target.value })}
            >
              <option value="">Selecione um tipo de consulta</option>
              {tiposConsulta.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>

            <label>Voluntário</label>
            <select className="select-agenda"
              value={formData.voluntario_id}
              onChange={(e) => setFormData({ ...formData, voluntario_id: e.target.value })}
            >
              <option value="">Selecione um voluntário</option>
              {voluntarios.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.nome}
                </option>
              ))}
            </select>
          </>
        ) : (
          <p>Carregando dados...</p>
        )}

        <button className="save-button" onClick={handleUpdate}>Salvar Alterações</button>
        <button className="close-button" onClick={onClose}>Cancelar</button>
        <button onClick={() => deletarConsulta(event.id, token)}> Excluir</button>

      </div>
    </div>
  );
};

export default ModalEditarConsulta;
