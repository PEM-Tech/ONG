const Categoria = require("../models/categoriaModel");
const Audit = require("../models/auditModel");

// Buscar todas as categorias
exports.getAllCategorias = async (req, res) => {
  try {
    const usuarioLogado = req.user?.nome || req.user?.email || "Desconhecido";

    const categorias = await Categoria.getAll();

    // Registrar na auditoria
    await Audit.log(usuarioLogado, "READ", "Listagem de todas as categorias");

    res.json(categorias);
  } catch (error) {
    console.error("❌ Erro ao buscar categorias:", error);
    res.status(500).json({ error: "Erro ao buscar categorias" });
  }
};

// Buscar categoria por ID
exports.getCategoriaById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioLogado = req.user?.nome || req.user?.email || "Desconhecido";

    const categoria = await Categoria.getById(id);
    if (!categoria) return res.status(404).json({ error: "Categoria não encontrada" });

    // Registrar na auditoria
    await Audit.log(usuarioLogado, "READ", `Consulta da categoria ID ${id}`);

    res.json(categoria);
  } catch (error) {
    console.error("❌ Erro ao buscar categoria:", error);
    res.status(500).json({ error: "Erro ao buscar categoria" });
  }
};

// Criar uma nova categoria
exports.createCategoria = async (req, res) => {
  try {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ error: "Nome é obrigatório" });

    const usuarioLogado = req.user?.nome || req.user?.email || "Desconhecido";

    const id = await Categoria.create(nome, usuarioLogado);

    // Registrar na auditoria
    await Audit.log(usuarioLogado, "CREATE", `Categoria criada: ${nome}`);

    res.status(201).json({ id, nome });
  } catch (error) {
    console.error("❌ Erro ao criar categoria:", error);
    res.status(500).json({ error: "Erro ao criar categoria" });
  }
};

// Atualizar uma categoria
exports.updateCategoria = async (req, res) => {
  try {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ error: "Nome é obrigatório" });

    const usuarioLogado = req.user?.nome || req.user?.email || "Desconhecido";

    await Categoria.update(req.params.id, nome, usuarioLogado);

    // Registrar na auditoria
    await Audit.log(usuarioLogado, "UPDATE", `Categoria atualizada: ${nome}`);

    res.json({ message: "Categoria atualizada com sucesso" });
  } catch (error) {
    console.error("❌ Erro ao atualizar categoria:", error);
    res.status(500).json({ error: "Erro ao atualizar categoria" });
  }
};

// Excluir uma categoria
exports.deleteCategoria = async (req, res) => {
  try {
    const usuarioLogado = req.user?.nome || req.user?.email || "Desconhecido";

    await Categoria.delete(req.params.id, usuarioLogado);

    // Registrar na auditoria
    await Audit.log(usuarioLogado, "DELETE", `Categoria ID ${req.params.id} excluída`);

    res.json({ message: "Categoria excluída com sucesso" });
  } catch (error) {
    console.error("❌ Erro ao excluir categoria:", error);
    res.status(500).json({ error: "Erro ao excluir categoria" });
  }
};
