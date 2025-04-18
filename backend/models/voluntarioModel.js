const connection = require("../config/database");
const Audit = require("../models/auditModel");

const Voluntario = {
  async create(data, usuario) {
    const query = `
      INSERT INTO voluntarios 
      (nome, cpf, celular, cep, rua, numero, bairro, cidade, estado, nascimento, genero, email, anexo_id, anexo2_id, anexo3_id, categoria_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      data.nome,
      data.cpf,
      data.celular,
      data.cep,
      data.rua || "Não informado",
      data.numero || "N/A",
      data.bairro || "Não informado",
      data.cidade || "Não informado",
      data.estado || "Não informado",
      data.nascimento || null,
      data.genero || "Não especificado",
      data.email || null,
      data.anexo_id ?? null,
      data.anexo2_id ?? null,
      data.anexo3_id ?? null,
      data.categoria_id ?? null
    ];

    const [result] = await connection.execute(query, values);
    await Audit.log(usuario, "CREATE", `Voluntário criado: ${data.nome}`);
    return result.insertId;
  },

  async findAll() {
    const query = "SELECT * FROM voluntarios";
    const [rows] = await connection.query(query);
    return rows;
  },

  async findById(id) {
    const query = "SELECT * FROM voluntarios WHERE id = ?";
    const [rows] = await connection.query(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  async update(id, data, usuario) {
    const query = `
      UPDATE voluntarios SET 
        nome = ?, cpf = ?, celular = ?, cep = ?, rua = ?, numero = ?, bairro = ?, 
        cidade = ?, estado = ?, nascimento = ?, genero = ?, email = ?, 
        anexo_id = COALESCE(?, anexo_id),
        anexo2_id = COALESCE(?, anexo2_id),
        anexo3_id = COALESCE(?, anexo3_id),
        categoria_id = ?
      WHERE id = ?
    `;

    const values = [
      data.nome,
      data.cpf,
      data.celular,
      data.cep,
      data.rua,
      data.numero,
      data.bairro,
      data.cidade,
      data.estado,
      data.nascimento,
      data.genero,
      data.email,
      data.anexo_id ?? null,
      data.anexo2_id ?? null,
      data.anexo3_id ?? null,
      data.categoria_id ?? null,
      id
    ];

    const [result] = await connection.execute(query, values);
    await Audit.log(usuario, "UPDATE", `Voluntário atualizado: ${data.nome}`);
    return result.affectedRows > 0;
  },

  async delete(id, usuario) {
    const query = "DELETE FROM voluntarios WHERE id = ?";
    const [result] = await connection.execute(query, [id]);
    if (result.affectedRows > 0) {
      await Audit.log(usuario, "DELETE", `Voluntário ID ${id} excluído`);
    }
    return result.affectedRows > 0;
  },

  async existsByCpf(cpf) {
    const query = "SELECT id FROM voluntarios WHERE cpf = ?";
    const [rows] = await connection.query(query, [cpf]);
    return rows.length > 0;
  }
};

module.exports = Voluntario;
