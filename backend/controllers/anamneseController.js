const Anamnese = require("../models/anamneseModel");

exports.createAnamnese = async (req, res) => {
  try {
    const data = req.body;
    const usuario = req.user?.id || "Sistema";

    if (!data.assistido_id) {
      return res.status(400).json({ message: "O campo 'assistido_id' é obrigatório." });
    }

    const novaAnamnese = await Anamnese.create(data, usuario);
    return res.status(201).json(novaAnamnese);
  } catch (error) {
    console.error("❌ Erro ao salvar anamnese:", error);
    return res.status(500).json({ message: "Erro ao salvar a ficha de anamnese." });
  }
};

exports.getAnamneseById = async (req, res) => {
  try {
    const { id } = req.params;
    const anamnese = await Anamnese.getById(id);
    return res.json(anamnese);
  } catch (error) {
    console.error("❌ Erro ao buscar anamnese:", error);
    return res.status(404).json({ message: "Ficha de anamnese não encontrada." });
  }
};

exports.getAllAnamneses = async (req, res) => {
  try {
    const anamneses = await Anamnese.getAll();
    return res.json(anamneses);
  } catch (error) {
    console.error("❌ Erro ao buscar anamneses:", error);
    return res.status(500).json({ message: "Erro ao buscar as fichas de anamnese." });
  }
};

exports.updateAnamnese = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const usuario = req.user?.id || "Sistema";

    const atualizada = await Anamnese.update(id, data, usuario);
    return res.json(atualizada);
  } catch (error) {
    console.error("❌ Erro ao atualizar anamnese:", error);
    return res.status(500).json({ message: "Erro ao atualizar a ficha de anamnese." });
  }
};

exports.deleteAnamnese = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = req.user?.id || "Sistema";

    const resultado = await Anamnese.delete(id, usuario);
    return res.json(resultado);
  } catch (error) {
    console.error("❌ Erro ao deletar anamnese:", error);
    return res.status(500).json({ message: "Erro ao deletar a ficha de anamnese." });
  }
};
