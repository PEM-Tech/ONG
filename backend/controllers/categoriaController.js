const Categoria = require("../models/categoriaModel");
const Audit = require("../models/auditModel");

exports.getAllCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.getAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar categorias" });
  }
};

exports.getCategoriaById = async (req, res) => {
  try {
    const categoria = await Categoria.getById(req.params.id);
    if (!categoria) return res.status(404).json({ error: "Categoria não encontrada" });
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar categoria" });
  }
};

exports.createCategoria = async (req, res) => {
  try {
    const { nome, usuario } = req.body;
    if (!nome) return res.status(400).json({ error: "Nome é obrigatório" });
    const id = await Categoria.create(nome, usuario);
    res.status(201).json({ id, nome });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar categoria" });
  }
};

exports.updateCategoria = async (req, res) => {
  try {
    const { nome, usuario } = req.body;
    if (!nome) return res.status(400).json({ error: "Nome é obrigatório" });
    await Categoria.update(req.params.id, nome, usuario);
    res.json({ message: "Categoria atualizada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar categoria" });
  }
};

exports.deleteCategoria = async (req, res) => {
  try {
    const { usuario } = req.body;
    await Categoria.delete(req.params.id, usuario);
    res.json({ message: "Categoria excluída com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir categoria" });
  }
};