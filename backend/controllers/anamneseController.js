// backend/controllers/anamneseController.js
const { validationResult } = require("express-validator");
// Certifique-se de que o modelo "Anamnese" esteja definido em ../models
const { Anamnese } = require("../models");

/**
 * Cria uma nova ficha de anamnese.
 * Os dados são recebidos via req.body (e possivelmente arquivos via req.files, se necessário).
 */
exports.createAnamnese = async (req, res) => {
  // Verifica se houve erros nas validações definidas na rota
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Extraia os dados do formulário
    const data = req.body;
    // Se necessário, processe ou converta dados (ex: data.nascimento para Date)
    // Exemplo: data.nascimento = new Date(data.nascimento);

    // Cria a ficha de anamnese
    const newAnamnese = await Anamnese.create(data);
    return res.status(201).json(newAnamnese);
  } catch (error) {
    console.error("Erro em createAnamnese:", error);
    return res
      .status(500)
      .json({ message: "Erro ao criar a ficha de anamnese", error: error.message });
  }
};

/**
 * Busca a ficha de anamnese associada a um assistido, utilizando o parâmetro "ficha".
 * Aqui, supomos que a tabela de anamnese possua um campo (por exemplo, assistido_id) que associa à ficha do assistido.
 */
exports.getAnamnese = async (req, res) => {
  try {
    const { ficha } = req.params;
    const anamnese = await Anamnese.findOne({ where: { assistido_id: ficha } });
    if (!anamnese) {
      return res.status(404).json({ message: "Ficha de anamnese não encontrada" });
    }
    return res.json(anamnese);
  } catch (error) {
    console.error("Erro em getAnamnese:", error);
    return res
      .status(500)
      .json({ message: "Erro ao buscar a ficha de anamnese", error: error.message });
  }
};

/**
 * Atualiza a ficha de anamnese associada a um assistido.
 */
exports.updateAnamnese = async (req, res) => {
  // Verifica erros de validação
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { ficha } = req.params;
    const data = req.body;
    const anamnese = await Anamnese.findOne({ where: { assistido_id: ficha } });
    if (!anamnese) {
      return res.status(404).json({ message: "Ficha de anamnese não encontrada" });
    }
    // Atualiza o registro com os novos dados
    await anamnese.update(data);
    return res.json(anamnese);
  } catch (error) {
    console.error("Erro em updateAnamnese:", error);
    return res
      .status(500)
      .json({ message: "Erro ao atualizar a ficha de anamnese", error: error.message });
  }
};

/**
 * Exclui a ficha de anamnese associada a um assistido.
 */
exports.deleteAnamnese = async (req, res) => {
  try {
    const { ficha } = req.params;
    const anamnese = await Anamnese.findOne({ where: { assistido_id: ficha } });
    if (!anamnese) {
      return res.status(404).json({ message: "Ficha de anamnese não encontrada" });
    }
    await anamnese.destroy();
    return res.json({ message: "Ficha de anamnese excluída com sucesso" });
  } catch (error) {
    console.error("Erro em deleteAnamnese:", error);
    return res
      .status(500)
      .json({ message: "Erro ao excluir a ficha de anamnese", error: error.message });
  }
};
