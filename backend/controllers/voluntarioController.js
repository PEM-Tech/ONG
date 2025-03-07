const { validationResult } = require("express-validator");
const Voluntario = require("../models/voluntarioModel");

// Criar um voluntário
exports.createVoluntario = async (req, res) => {
  const errors = validationResult(req);
  console.log(req.body)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Verifica se o campo 'nome' foi enviado
  if (!req.body.nome) {
    return res.status(400).json({ error: "O campo 'nome' é obrigatório." });
  }

  // Sanitiza os dados: converte valores undefined para null
  const voluntarioData = {
    nome: req.body.nome, // já validado para não ser nulo
    cpf: req.body.cpf ?? null,
    celular: req.body.celular ?? null,
    cep: req.body.cep ?? null,
    numero: req.body.numero ?? null,
    bairro: req.body.bairro ?? null,
    cidade: req.body.cidade ?? null,
    estado: req.body.estado ?? null,
    nascimento: req.body.nascimento ?? null,
    genero: req.body.genero ?? null,
    email: req.body.email ?? null,
    // Removendo 'agenda' se ela não existir na tabela ou validando se necessário
    anexo_id: req.body.anexo_id ?? null,
  };

  try {
    // Verifica se o CPF já existe
    const cpfExists = await Voluntario.existsByCpf(voluntarioData.cpf);
    if (cpfExists) {
      return res.status(400).json({ error: "CPF já cadastrado" });
    }
    console.log(req.body)

    // Criar novo voluntário
    const voluntarioId = await Voluntario.create(voluntarioData);
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
  // Se o campo 'nome' é obrigatório, você também pode verificar aqui:
  if (req.body.nome === undefined || req.body.nome === null) {
    return res.status(400).json({ error: "O campo 'nome' é obrigatório para atualização." });
  }

  // Sanitiza os dados: converte valores undefined para null
  const voluntarioData = {
    nome: req.body.nome,
    cpf: req.body.cpf ?? null,
    celular: req.body.celular ?? null,
    cep: req.body.cep ?? null,
    numero: req.body.numero ?? null,
    bairro: req.body.bairro ?? null,
    cidade: req.body.cidade ?? null,
    estado: req.body.estado ?? null,
    nascimento: req.body.nascimento ?? null,
    genero: req.body.genero ?? null,
    email: req.body.email ?? null,
    // Removendo 'agenda' se não for necessário
    anexo_id: req.body.anexo_id ?? null,
  };

  try {
    const voluntarioExistente = await Voluntario.findById(req.params.id);
    if (!voluntarioExistente) {
      return res.status(404).json({ error: "Voluntário não encontrado" });
    }

    const updated = await Voluntario.update(req.params.id, voluntarioData);
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
