const db = require("../config/database");

const Audit = {
  async log(usuario, tipo, mensagem) {
    await db.promise().execute(
      "INSERT INTO audit (usuario, tipo, mensagem, data_hora) VALUES (?, ?, ?, NOW())",
      [usuario, tipo, mensagem]
    );
  },
};

module.exports = Audit;