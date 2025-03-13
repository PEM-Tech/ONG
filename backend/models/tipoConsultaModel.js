const db = require("../config/database");
const Audit = require("./auditModel");

const TipoConsulta = {
  async getAll() {
    const [rows] = await db.promise().query("SELECT * FROM tipos_consulta");
    return rows;
  },

  async getById(id) {
    const [rows] = await db.promise().query("SELECT * FROM tipos_consulta WHERE id = ?", [id]);
    return rows[0];
  },

  async create(nome, usuario) {
    const [result] = await db.promise().execute("INSERT INTO tipos_consulta (nome) VALUES (?)", [nome]);
    await Audit.log(usuario, "CREATE", `Tipo de consulta criado: ${nome}`);
    return result.insertId;
  },

  async update(id, nome, usuario) {
    await db.promise().execute("UPDATE tipos_consulta SET nome = ? WHERE id = ?", [nome, id]);
    await Audit.log(usuario, "UPDATE", `Tipo de consulta atualizado: ${nome}`);
    return true;
  },

  async delete(id, usuario) {
    await db.promise().execute("DELETE FROM tipos_consulta WHERE id = ?", [id]);
    await Audit.log(usuario, "DELETE", `Tipo de consulta ID ${id} excluído`);
    return true;
  }
};

module.exports = TipoConsulta;
