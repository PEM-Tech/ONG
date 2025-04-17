const db = require("../config/database");

const Audit = {
  // Registrar um log de auditoria
  async log(usuario, tipo, mensagem) {
    try {
      if (!usuario || !tipo || !mensagem) {
        throw new Error("Todos os campos (usuario, tipo, mensagem) são obrigatórios.");
      }

      await db.execute(
        "INSERT INTO audit (usuario, tipo, mensagem, data_hora) VALUES (?, ?, ?, NOW())",
        [usuario, tipo, mensagem]
      );

      return true; // Sucesso ao inserir
    } catch (error) {
      console.error("Erro ao registrar auditoria:", error);
      return false; // Falha na inserção
    }
  },

  // Buscar todos os logs de auditoria
  async getAll() {
    try {
      const [rows] = await db.query(
        "SELECT usuario, tipo, mensagem, data_hora FROM audit ORDER BY data_hora DESC"
      );
      return rows;
    } catch (error) {
      console.error("Erro ao buscar logs de auditoria:", error);
      return [];
    }
  },
};

module.exports = Audit;
