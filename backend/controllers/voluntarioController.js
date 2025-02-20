const { validationResult } = require("express-validator");
const Voluntario = require("../models/voluntarioModel");

// Criar um voluntário
exports.createVoluntario = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Verifica se o CPF já existe
    const cpfExists = await Voluntario.existsByCpf(req.body.cpf);
    if (cpfExists) {
      return res.status(400).json({ error: "CPF já cadastrado" });
    }

    // Criar novo voluntário
    const voluntarioId = await Voluntario.create(req.body);
    res.status(201).json({ message: "Voluntário cadastrado com sucesso!", id: voluntarioId });
  } catch (error) {
    console.error("Erro ao cadastrar voluntário:", error);
    res.status(500).json({ error: "Erro ao cadastrar voluntário. Tente novamente mais tarde." });
  }
};

// Buscar todos os voluntários
exports.getAllVoluntarios = async (req, res) => {
  try {
    const voluntarios = await Voluntario.findAll();
    res.status(200).json(voluntarios);
  } catch (error) {
    console.error("Erro ao buscar voluntários:", error);
    res.status(500).json({ error: "Erro ao buscar voluntários." });
  }
};

// Buscar um voluntário específico
exports.getVoluntarioById = async (req, res) => {
  try {
    const voluntario = await Voluntario.findById(req.params.id);
    if (!voluntario) {
      return res.status(404).json({ error: "Voluntário não encontrado" });
    }
    res.status(200).json(voluntario);
  } catch (error) {
    console.error("Erro ao buscar voluntário:", error);
    res.status(500).json({ error: "Erro ao buscar voluntário." });
  }
};

// Atualizar um voluntário
exports.updateVoluntario = async (req, res) => {
  try {
    const voluntarioExistente = await Voluntario.findById(req.params.id);
    if (!voluntarioExistente) {
      return res.status(404).json({ error: "Voluntário não encontrado" });
    }

    const updated = await Voluntario.update(req.params.id, req.body);
    if (updated) {
      res.status(200).json({ message: "Voluntário atualizado com sucesso!" });
    } else {
      res.status(400).json({ error: "Erro ao atualizar voluntário" });
    }
  } catch (error) {
    console.error("Erro ao atualizar voluntário:", error);
    res.status(500).json({ error: "Erro ao atualizar voluntário. Tente novamente mais tarde." });
  }
};

// Excluir um voluntário
exports.deleteVoluntario = async (req, res) => {
  try {
    const voluntarioExistente = await Voluntario.findById(req.params.id);
    if (!voluntarioExistente) {
      return res.status(404).json({ error: "Voluntário não encontrado" });
    }

    const deleted = await Voluntario.delete(req.params.id);
    if (deleted) {
      res.status(200).json({ message: "Voluntário excluído com sucesso!" });
    } else {
      res.status(400).json({ error: "Erro ao excluir voluntário." });
    }
  } catch (error) {
    console.error("Erro ao excluir voluntário:", error);
    res.status(500).json({ error: "Erro ao excluir voluntário. Tente novamente mais tarde." });
  }
};
