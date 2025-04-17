const db = require("../config/database");
const Audit = require("./auditModel");

const Categoria = {
  // Buscar todas as categorias
  async getAll(usuario) {
    const [rows] = await db.query("SELECT * FROM categorias");
    await Audit.log(usuario, "READ", "Listagem de todas as categorias");
    return rows;
  },

  // Buscar categoria por ID
  async getById(id, usuario) {
    const [rows] = await db.query("SELECT * FROM categorias WHERE id = ?", [id]);
    if (rows.length === 0) {
      throw new Error("Categoria não encontrada.");
    }
    await Audit.log(usuario, "READ", `Consulta da categoria ID ${id}`);
    return rows[0];
  },

  // Criar uma nova categoria
  async create(nome, usuario) {
    const [result] = await db.execute("INSERT INTO categorias (nome) VALUES (?)", [nome]);
    await Audit.log(usuario, "CREATE", `Categoria criada: ${nome}`);
    return result.insertId;
  },

  // Atualizar uma categoria
  async update(id, nome, usuario) {
    // Verifica se a categoria existe antes de atualizar
    const [exists] = await db.query("SELECT id FROM categorias WHERE id = ?", [id]);
    if (exists.length === 0) {
      throw new Error("Categoria não encontrada.");
    }

    await db.execute("UPDATE categorias SET nome = ? WHERE id = ?", [nome, id]);
    await Audit.log(usuario, "UPDATE", `Categoria atualizada: ${nome}`);
    return true;
  },

  // Excluir uma categoria
  async delete(id, usuario) {
    // Verifica se a categoria existe antes de excluir
    const [exists] = await db.query("SELECT id FROM categorias WHERE id = ?", [id]);
    if (exists.length === 0) {
      throw new Error("Categoria não encontrada.");
    }

    await db.execute("DELETE FROM categorias WHERE id = ?", [id]);
    await Audit.log(usuario, "DELETE", `Categoria ID ${id} excluída`);
    return true;
  }
};

module.exports = Categoria;
