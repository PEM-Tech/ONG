const connection = require("../config/database");

const Voluntario = {
  // Criar um novo voluntário
  async create(data) {
    const query = `
      INSERT INTO voluntarios 
      (nome, cpf, celular, cep, numero, bairro, cidade, estado, nascimento, genero, email, agenda, anexo_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      data.nome, data.cpf, data.celular, data.cep, data.numero, 
      data.bairro, data.cidade, data.estado, data.nascimento, 
      data.genero, data.email, data.agenda, data.anexo_id
    ];

    const [result] = await connection.promise().execute(query, values);
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
  async update(id, data) {
    const query = `
      UPDATE voluntarios SET 
        nome = ?, cpf = ?, celular = ?, cep = ?, numero = ?, bairro = ?, 
        cidade = ?, estado = ?, nascimento = ?, genero = ?, email = ?, 
        agenda = ?, anexo_id = COALESCE(?, anexo_id) 
      WHERE id = ?
    `;
    
    const values = [
      data.nome, data.cpf, data.celular, data.cep, data.numero, 
      data.bairro, data.cidade, data.estado, data.nascimento, 
      data.genero, data.email, data.agenda, data.anexo_id, id
    ];

    const [result] = await connection.promise().execute(query, values);
    return result.affectedRows > 0;
  },

  // Excluir um voluntário
  async delete(id) {
    const query = "DELETE FROM voluntarios WHERE id = ?";
    const [result] = await connection.promise().execute(query, [id]);
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
