const connection = require("../config/database");

const Assistido = {
  // Criar um novo assistido com auditoria
  async create(data, executadoPor) {
    const query = `
      INSERT INTO assistidos 
      (ficha, nome, cpf, celular, cep, numero, bairro, cidade, estado, nascimento, genero, email, 
       de_menor, assistido_id, cesta_basica, data_assistente_social, anamnese, anexo_id, anexo2_id, anexo3_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      data.ficha, data.nome, data.cpf, data.celular, data.cep, data.numero, 
      data.bairro, data.cidade, data.estado, data.nascimento, data.genero, 
      data.email, data.de_menor, data.assistido_id, data.cesta_basica, 
      data.data_assistente_social, data.anamnese, data.anexo_id, 
      data.anexo2_id, data.anexo3_id
    ];

    const [result] = await connection.promise().execute(query, values);

    // Adiciona auditoria
    await this.addAudit("insert", data.ficha || result.insertId, null, data, executadoPor);

    return data.ficha || result.insertId;
  },

  // Buscar todos os assistidos
  async findAll() {
    const query = "SELECT * FROM assistidos";
    const [rows] = await connection.promise().query(query);
    return rows;
  },

  // Buscar um assistido por ficha
  async findByFicha(ficha) {
    const query = "SELECT * FROM assistidos WHERE ficha = ?";
    const [rows] = await connection.promise().query(query, [ficha]);
    return rows.length > 0 ? rows[0] : null;
  },

  // Atualizar um assistido com auditoria
  async update(ficha, data, executadoPor) {
    // Captura os dados antes da alteração
    const antigo = await this.findByFicha(ficha);
    if (!antigo) return false; // Se não existe, retorna falso

    const query = `
      UPDATE assistidos SET 
        nome = ?, cpf = ?, celular = ?, cep = ?, numero = ?, bairro = ?, 
        cidade = ?, estado = ?, nascimento = ?, genero = ?, email = ?, 
        de_menor = ?, assistido_id = ?, cesta_basica = ?, 
        data_assistente_social = ?, anamnese = ?, 
        anexo_id = COALESCE(?, anexo_id), 
        anexo2_id = COALESCE(?, anexo2_id), 
        anexo3_id = COALESCE(?, anexo3_id) 
      WHERE ficha = ?
    `;
    
    const values = [
      data.nome, data.cpf, data.celular, data.cep, data.numero, 
      data.bairro, data.cidade, data.estado, data.nascimento, 
      data.genero, data.email, data.de_menor, data.assistido_id, 
      data.cesta_basica, data.data_assistente_social, data.anamnese, 
      data.anexo_id, data.anexo2_id, data.anexo3_id, ficha
    ];

    const [result] = await connection.promise().execute(query, values);

    if (result.affectedRows > 0) {
      // Adiciona auditoria
      await this.addAudit("update", ficha, antigo, data, executadoPor);
    }

    return result.affectedRows > 0;
  },

  // Excluir um assistido com auditoria
  async delete(ficha, executadoPor) {
    // Captura os dados antes da exclusão
    const antigo = await this.findByFicha(ficha);
    if (!antigo) return false;

    const query = "DELETE FROM assistidos WHERE ficha = ?";
    const [result] = await connection.promise().execute(query, [ficha]);

    if (result.affectedRows > 0) {
      // Adiciona auditoria
      await this.addAudit("delete", ficha, antigo, null, executadoPor);
    }

    return result.affectedRows > 0;
  },

  // Verificar se um CPF já existe
  async existsByCpf(cpf) {
    const query = "SELECT ficha FROM assistidos WHERE cpf = ?";
    const [rows] = await connection.promise().query(query, [cpf]);
    return rows.length > 0;
  },

  // Adicionar auditoria
  async addAudit(acao, id_registro, dadosAnteriores, dadosNovos, executadoPor) {
    const query = `
      INSERT INTO audit (tabela, id_registro, acao, dados_anteriores, dados_novos, executado_por, data_hora)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const dataHora = new Date().toISOString().slice(0, 19).replace("T", " ");

    const values = [
      "assistidos",
      id_registro,
      acao,
      dadosAnteriores ? JSON.stringify(dadosAnteriores) : null,
      dadosNovos ? JSON.stringify(dadosNovos) : null,
      executadoPor,
      dataHora
    ];

    await connection.promise().execute(query, values);
  }
};

module.exports = Assistido;
