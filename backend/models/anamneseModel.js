const connection = require("../config/database");
const Audit = require("../models/auditModel");

class Anamnese {
  
  static async create(data, usuario) {
    console.log("Dados recebidos:", data);

    try {
      const campos = Object.keys(data);
      const valores = Object.values(data);

      const placeholders = campos.map(() => "?").join(", ");
      const insertQuery = `
        INSERT INTO anamnese (${campos.join(", ")})
        VALUES (${placeholders})
      `;

      const [result] = await connection.query(insertQuery, valores);

      await Audit.log(usuario ?? "Sistema", "CREATE", `Anamnese criada para o assistido ID ${data.assistido_id}`);
      return { id: result.insertId, ...data };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [result] = await connection.query("SELECT * FROM anamnese WHERE id = ?", [id]);
      if (result.length === 0) throw new Error("Ficha de anamnese não encontrada.");
      return result[0];
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    try {
      const [results] = await connection.query("SELECT * FROM anamnese ORDER BY id DESC");
      return results;
    } catch (error) {
      throw error;
    }
  }

static async update(id, data, usuario) {
  try {
    const campos = Object.keys(data);
    const valores = Object.values(data);

    const setClause = campos.map(campo => `${campo} = ?`).join(", ");
    const updateQuery = `UPDATE anamnese SET ${setClause} WHERE id = ?`;

    await connection.query(updateQuery, [...valores, id]);

    await Audit.log(usuario ?? "Sistema", "UPDATE", `Anamnese ID ${id} atualizada`);
    return { id, ...data };
  } catch (error) {
    throw error;
  }
}

static async delete(id, usuario) {
  try {
    const [existe] = await connection.query("SELECT id FROM anamnese WHERE id = ?", [id]);
    if (existe.length === 0) throw new Error("Ficha de anamnese não encontrada.");

    await connection.query("DELETE FROM anamnese WHERE id = ?", [id]);

    await Audit.log(usuario ?? "Sistema", "DELETE", `Anamnese ID ${id} excluída`);
    return { message: "Ficha de anamnese excluída com sucesso." };
  } catch (error) {
    throw error;
  }
}
}
module.exports = Anamnese;
