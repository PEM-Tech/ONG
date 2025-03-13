const Audit = require("../models/auditModel");

// Buscar todos os registros de auditoria (sem a coluna id)
exports.getAllLogs = async (req, res) => {
    try {
      const logs = await Audit.getAll();
      res.json(logs); // Certifique-se de que está retornando JSON corretamente
    } catch (error) {
      console.error("Erro ao buscar auditoria:", error);
      res.status(500).json({ error: "Erro ao buscar registros de auditoria." });
    }
  };
  

// Criar um novo log manualmente (caso necessário)
exports.createLog = async (req, res) => {
  try {
    const { usuario, tipo, mensagem } = req.body;

    if (!usuario || !tipo || !mensagem) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    await Audit.log(usuario, tipo, mensagem);
    res.status(201).json({ message: "Log criado com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o log." });
  }
};
