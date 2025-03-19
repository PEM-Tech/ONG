const { validationResult } = require("express-validator");
const Voluntario = require("../models/voluntarioModel");
const Audit = require("../models/auditModel");
const connection = require("../config/database");

// 📌 Função para salvar anexos
async function inserirAnexo(file) {
  if (!file) return null;
  const query = `INSERT INTO anexos (nome, tamanho, path) VALUES (?, ?, ?)`;
  const values = [file.originalname, file.size, file.path];
  const [result] = await connection.promise().execute(query, values);
  return result.insertId;
}

// 📌 Criar Voluntário
exports.createVoluntario = async (req, res) => {
  try {
    const usuario = req.user?.nome || req.user?.email || "Desconhecido";

    // 📌 Captura os anexos
    const files = req.files;
    let anexo_id = await inserirAnexo(files?.anexo_id?.[0]);
    let anexo2_id = await inserirAnexo(files?.anexo2_id?.[0]);
    let anexo3_id = await inserirAnexo(files?.anexo3_id?.[0]);

    // 📌 Dados do Voluntário
    const voluntarioData = {
      nome: req.body.nome,
      cpf: req.body.cpf ?? null,
      celular: req.body.celular ?? null,
      cep: req.body.cep ?? null,
      rua: req.body.rua ?? null,
      numero: req.body.numero ?? null,
      bairro: req.body.bairro ?? null,
      cidade: req.body.cidade ?? null,
      estado: req.body.estado ?? null,
      nascimento: req.body.nascimento ?? null,
      genero: req.body.genero ?? null,
      email: req.body.email ?? null,
      anexo_id,
      anexo2_id,
      anexo3_id,
    };

    const voluntarioId = await Voluntario.create(voluntarioData, usuario);
    await Audit.log(usuario, "CREATE", `Voluntário criado: ${voluntarioData.nome}`);

    res.status(201).json({ message: "Voluntário cadastrado com sucesso!", id: voluntarioId });
  } catch (error) {
    console.error("❌ Erro ao cadastrar voluntário:", error);
    res.status(500).json({ error: "Erro ao cadastrar voluntário. Tente novamente mais tarde." });
  }
};

// 📌 Atualizar Voluntário
exports.updateVoluntario = async (req, res) => {
  try {
    const usuario = req.user?.nome || req.user?.email || "Desconhecido";
    const voluntarioExistente = await Voluntario.findById(req.params.id);
    if (!voluntarioExistente) {
      return res.status(404).json({ error: "Voluntário não encontrado" });
    }

    // 📌 Captura os anexos
    const files = req.files;
    let anexo_id = await inserirAnexo(files?.anexo_id?.[0]);
    let anexo2_id = await inserirAnexo(files?.anexo2_id?.[0]);
    let anexo3_id = await inserirAnexo(files?.anexo3_id?.[0]);

    // 📌 Dados Atualizados
    const voluntarioData = {
      nome: req.body.nome,
      cpf: req.body.cpf ?? null,
      celular: req.body.celular ?? null,
      cep: req.body.cep ?? null,
      rua: req.body.rua ?? null,
      numero: req.body.numero ?? null,
      bairro: req.body.bairro ?? null,
      cidade: req.body.cidade ?? null,
      estado: req.body.estado ?? null,
      nascimento: req.body.nascimento ?? null,
      genero: req.body.genero ?? null,
      email: req.body.email ?? null,
      anexo_id: anexo_id ?? voluntarioExistente.anexo_id,
      anexo2_id: anexo2_id ?? voluntarioExistente.anexo2_id,
      anexo3_id: anexo3_id ?? voluntarioExistente.anexo3_id,
    };

    const updated = await Voluntario.update(req.params.id, voluntarioData);
    if (updated) {
      await Audit.log(usuario, "UPDATE", `Voluntário atualizado: ${voluntarioData.nome}`);
      res.status(200).json({ message: "Voluntário atualizado com sucesso!" });
    } else {
      res.status(400).json({ error: "Erro ao atualizar voluntário" });
    }
  } catch (error) {
    console.error("❌ Erro ao atualizar voluntário:", error);
    res.status(500).json({ error: "Erro ao atualizar voluntário. Tente novamente mais tarde." });
  }
};


// Excluir um voluntário
exports.deleteVoluntario = async (req, res) => {
  try {
    const id = req.params.id;
    const usuarioLogado = req.user?.nome || req.user?.email || "Desconhecido";

    await connection.promise().query("DELETE FROM voluntarios WHERE id = ?", [id]);

    // Registrar na auditoria
    await Audit.log(usuarioLogado, "DELETE", `Voluntário ID ${id} excluído`);

    res.status(200).json({ message: "Voluntário excluído com sucesso!" });
  } catch (error) {
    console.error("❌ Erro ao excluir voluntário:", error);
    res.status(500).json({ error: "Erro ao excluir voluntário. Tente novamente mais tarde." });
  }
};

// Buscar todos os voluntários
exports.getAllVoluntarios = async (req, res) => {
  try {
    const usuario = req.user?.nome || req.user?.email || "Desconhecido";
    const [voluntarios] = await connection.promise().query("SELECT * FROM voluntarios");

    // Registrar na auditoria
    await Audit.log(usuario, "READ", "Listagem de todos os voluntários");

    res.status(200).json(voluntarios);
  } catch (error) {
    console.error("❌ Erro ao buscar voluntários:", error);
    res.status(500).json({ error: "Erro ao buscar voluntários." });
  }
};

// Buscar um voluntário específico
exports.getVoluntarioById = async (req, res) => {
  try {
    const id = req.params.id;
    const usuario = req.user?.nome || req.user?.email || "Desconhecido";

    const [voluntario] = await connection.promise().query("SELECT * FROM voluntarios WHERE id = ?", [id]);

    if (voluntario.length === 0) {
      return res.status(404).json({ error: "Voluntário não encontrado" });
    }

    // Registrar na auditoria
    await Audit.log(usuario, "READ", `Consulta do voluntário ID ${id}`);

    res.status(200).json(voluntario[0]);
  } catch (error) {
    console.error("❌ Erro ao buscar voluntário:", error);
    res.status(500).json({ error: "Erro ao buscar voluntário." });
  }
};
