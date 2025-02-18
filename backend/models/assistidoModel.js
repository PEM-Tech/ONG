const connection = require("../config/database");

const Assistido = {
  // Criar um novo assistido
  async create(data) {
    const query = `
      INSERT INTO assistidos 
      (nome, cpf, celular, cep, rua, numero, bairro, cidade, estado, nascimento, genero, email, de_menor, parentesco, cesta_basica, data_assistente_social, anamnese, anexo_id, anexo2_id, anexo3_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      data.nome, data.cpf, data.celular, data.cep, data.rua, data.numero, 
      data.bairro, data.cidade, data.estado, data.nascimento, data.genero, 
      data.email, data.de_menor, data.parentesco, data.cesta_basica, 
      data.data_assistente_social, data.anamnese, data.anexo_id, 
      data.anexo2_id, data.anexo3_id
    ];

    const [result] = await connection.promise().execute(query, values);
    return result.insertId;
  },

  // Buscar todos os assistidos
  async findAll() {
    const query = "SELECT * FROM assistidos";
    const [rows] = await connection.promise().query(query);
    return rows;
  },

  // Buscar um assistido por ID
  async findById(id) {
    const query = "SELECT * FROM assistidos WHERE id = ?";
    const [rows] = await connection.promise().query(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  // Atualizar um assistido
  async update(id, data) {
    const query = `
      UPDATE assistidos SET 
        nome = ?, cpf = ?, celular = ?, cep = ?, rua = ?, numero = ?, bairro = ?, 
        cidade = ?, estado = ?, nascimento = ?, genero = ?, email = ?, de_menor = ?, 
        parentesco = ?, cesta_basica = ?, data_assistente_social = ?, anamnese = ?, 
        anexo_id = COALESCE(?, anexo_id), 
        anexo2_id = COALESCE(?, anexo2_id), 
        anexo3_id = COALESCE(?, anexo3_id) 
      WHERE id = ?
    `;
    
    const values = [
      data.nome, data.cpf, data.celular, data.cep, data.rua, data.numero, 
      data.bairro, data.cidade, data.estado, data.nascimento, data.genero, 
      data.email, data.de_menor, data.parentesco, data.cesta_basica, 
      data.data_assistente_social, data.anamnese, data.anexo_id, 
      data.anexo2_id, data.anexo3_id, id
    ];

    const [result] = await connection.promise().execute(query, values);
    return result.affectedRows > 0;
  },

  // Excluir um assistido
  async delete(id) {
    const query = "DELETE FROM assistidos WHERE id = ?";
    const [result] = await connection.promise().execute(query, [id]);
    return result.affectedRows > 0;
  },

  // Verificar se um CPF já existe
  async existsByCpf(cpf) {
    const query = "SELECT id FROM assistidos WHERE cpf = ?";
    const [rows] = await connection.promise().query(query, [cpf]);
    return rows.length > 0;
  }
};

module.exports = Assistido;
