const Agenda = require("../models/agendaModel");

// 🔹 Criar um novo agendamento
exports.createAgenda = async (req, res) => {
  try {
    const { title, data_hora, tipo_consulta_id, ficha_assistido, voluntario_id } = req.body;

    if (!title || !data_hora || !tipo_consulta_id || !ficha_assistido || !voluntario_id) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    const newAgenda = await Agenda.create({ title, data_hora, tipo_consulta_id, ficha_assistido, voluntario_id });
    res.status(201).json(newAgenda);
  } catch (error) {
    console.error("❌ Erro ao criar agendamento:", error);
    res.status(500).json({ error: "Erro ao criar agendamento." });
  }
};

// 🔹 Buscar todos os agendamentos
exports.getAllAgendas = async (req, res) => {
  try {
    const agendas = await Agenda.getAll();
    res.json(agendas);
  } catch (error) {
    console.error("❌ Erro ao buscar agendamentos:", error);
    res.status(500).json({ error: "Erro ao buscar agendamentos." });
  }
};

// 🔹 Buscar um agendamento por ID
exports.getAgendaById = async (req, res) => {
  try {
    const { id } = req.params;
    const agenda = await Agenda.getById(id);
    if (!agenda) {
      return res.status(404).json({ error: "Agendamento não encontrado." });
    }
    res.json(agenda);
  } catch (error) {
    console.error("❌ Erro ao buscar agendamento:", error);
    res.status(500).json({ error: "Erro ao buscar agendamento." });
  }
};

// 🔹 Atualizar um agendamento
exports.updateAgenda = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, data_hora, tipo_consulta_id, ficha_assistido, voluntario_id } = req.body;

    if (!title || !data_hora || !tipo_consulta_id || !ficha_assistido || !voluntario_id) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    const updatedAgenda = await Agenda.update(id, { title, data_hora, tipo_consulta_id, ficha_assistido, voluntario_id });
    res.json(updatedAgenda);
  } catch (error) {
    console.error("❌ Erro ao atualizar agendamento:", error);
    res.status(500).json({ error: "Erro ao atualizar agendamento." });
  }
};

// 🔹 Deletar um agendamento
exports.deleteAgenda = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Agenda.delete(id);
    res.json(result);
  } catch (error) {
    console.error("❌ Erro ao deletar agendamento:", error);
    res.status(500).json({ error: "Erro ao deletar agendamento." });
  }
};
