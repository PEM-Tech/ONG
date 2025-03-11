const db = require("../config/database");
const Audit = require("./auditModel");

const Categoria = {
  async getAll() {
    const [rows] = await db.promise().query("SELECT * FROM categorias");
    return rows;
  },

  async getById(id) {
    const [rows] = await db.promise().query("SELECT * FROM categorias WHERE id = ?", [id]);
    return rows[0];
  },

  async create(nome, usuario) {
    const [result] = await db.promise().execute("INSERT INTO categorias (nome) VALUES (?)", [nome]);
    await Audit.log(usuario, "CREATE", `Categoria criada: ${nome}`);
    return result.insertId;
  },

  async update(id, nome, usuario) {
    await db.promise().execute("UPDATE categorias SET nome = ? WHERE id = ?", [nome, id]);
    await Audit.log(usuario, "UPDATE", `Categoria atualizada: ${nome}`);
    return true;
  },

  async delete(id, usuario) {
    await db.promise().execute("DELETE FROM categorias WHERE id = ?", [id]);
    await Audit.log(usuario, "DELETE", `Categoria ID ${id} excluída`);
    return true;
  }
};

module.exports = Categoria;