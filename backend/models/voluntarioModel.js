const connection = require("../config/database");
const Audit = require("../models/auditModel");

const Voluntario = {
  async create(data, usuario) {
    const query = `
      INSERT INTO voluntarios 
      (nome, cpf, celular, cep, rua, numero, bairro, cidade, estado, nascimento, genero, email, anexo_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    ];
  
    const [result] = await connection.promise().execute(query, values);
    await Audit.log(usuario, "CREATE", `Voluntário criado: ${data.nome}`);
    return result.insertId;
  },
  


  
  // Buscar todos os voluntários
  async findAll() {
    const query = "SELECT * FROM voluntarios";
    const [rows] = await connection.promise().query(query);
    return rows;
  },

  // Buscar um voluntário por ID
  async findById(id) {
    const query = "SELECT * FROM voluntarios WHERE id = ?";
    const [rows] = await connection.promise().query(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  // Atualizar um voluntário
  async update(id, data, usuario) {
    const anexoIdValue = data.anexo_id ?? null;

    const query = `
      UPDATE voluntarios SET 
        nome = ?, cpf = ?, celular = ?, cep = ?, rua = ?, numero = ?, bairro = ?, 
        cidade = ?, estado = ?, nascimento = ?, genero = ?, email = ?, 
        anexo_id = COALESCE(?, anexo_id) 
      WHERE id = ?
    `;

    const values = [
      data.nome, data.cpf, data.celular, data.cep, data.rua, data.numero,
      data.bairro, data.cidade, data.estado, data.nascimento,
      data.genero, data.email, anexoIdValue, id
    ];

    console.log("Query de atualização:", query);
    console.log("Valores passados:", values);

    const [result] = await connection.promise().execute(query, values);
    await Audit.log(usuario, "UPDATE", `Voluntário atualizado: ${data.nome}`);
    return result.affectedRows > 0;
  },

  // Excluir um voluntário
  async delete(id, usuario) {
    const query = "DELETE FROM voluntarios WHERE id = ?";
    const [result] = await connection.promise().execute(query, [id]);
    if (result.affectedRows > 0) {
      await Audit.log(usuario, "DELETE", `Voluntário ID ${id} excluído`);
    }
    return result.affectedRows > 0;
  },

  // Verificar se um CPF já existe
  async existsByCpf(cpf) {
    const query = "SELECT id FROM voluntarios WHERE cpf = ?";
    const [rows] = await connection.promise().query(query, [cpf]);
    return rows.length > 0;
  }
};

module.exports = Voluntario;
