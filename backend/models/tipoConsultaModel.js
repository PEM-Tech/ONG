const db = require("../config/database");
const Audit = require("./auditModel");

const TipoConsulta = {
  // Buscar todos os tipos de consulta
  async getAll(usuario) {
    const [rows] = await db.promise().query("SELECT * FROM tipos_consulta");
    await Audit.log(usuario, "READ", "Listagem de todos os tipos de consulta");
    return rows;
  },

  // Buscar tipo de consulta por ID
  async getById(id, usuario) {
    const [rows] = await db.promise().query("SELECT * FROM tipos_consulta WHERE id = ?", [id]);
    if (rows.length === 0) {
      throw new Error("Tipo de consulta não encontrado.");
    }
    await Audit.log(usuario, "READ", `Consulta do tipo de consulta ID ${id}`);
    return rows[0];
  },

  // Criar um novo tipo de consulta
  async create(nome, usuario) {
    const [result] = await db.promise().execute("INSERT INTO tipos_consulta (nome) VALUES (?)", [nome]);
    await Audit.log(usuario, "CREATE", `Tipo de consulta criado: ${nome}`);
    return result.insertId;
  },

  // Atualizar um tipo de consulta
  async update(id, nome, usuario) {
    // Verifica se o tipo de consulta existe antes de atualizar
    const [exists] = await db.promise().query("SELECT id FROM tipos_consulta WHERE id = ?", [id]);
    if (exists.length === 0) {
      throw new Error("Tipo de consulta não encontrado.");
    }

    await db.promise().execute("UPDATE tipos_consulta SET nome = ? WHERE id = ?", [nome, id]);
    await Audit.log(usuario, "UPDATE", `Tipo de consulta atualizado: ${nome}`);
    return true;
  },

  // Excluir um tipo de consulta
  async delete(id, usuario) {
    // Verifica se o tipo de consulta existe antes de excluir
    const [exists] = await db.promise().query("SELECT id FROM tipos_consulta WHERE id = ?", [id]);
    if (exists.length === 0) {
      throw new Error("Tipo de consulta não encontrado.");
    }

    await db.promise().execute("DELETE FROM tipos_consulta WHERE id = ?", [id]);
    await Audit.log(usuario, "DELETE", `Tipo de consulta ID ${id} excluído`);
    return true;
  }
};

module.exports = TipoConsulta;
