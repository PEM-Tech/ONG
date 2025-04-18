const connection = require("../config/database");
const Audit = require("../models/auditModel");

const Assistido = {
  // Criar um novo assistido com auditoria
  async create(data, executadoPor) {
    const query = `
      INSERT INTO assistidos 
      (ficha, nome, cpf, celular, cep, rua, numero, bairro, cidade, estado, nascimento, genero, email, 
       de_menor, assistido_id, cesta_basica, data_assistente_social, anamnese, anexo_id, anexo2_id, anexo3_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      data.ficha, data.nome, data.cpf, data.celular, data.cep, data.rua, data.numero, 
      data.bairro, data.cidade, data.estado, data.nascimento, data.genero, 
      data.email, data.de_menor, data.assistido_id, data.cesta_basica, 
      data.data_assistente_social, data.anamnese, data.anexo_id, 
      data.anexo2_id, data.anexo3_id
    ];

    const [result] = await connection.execute(query, values);
    await Audit.log(executadoPor, "CREATE", `Assistido criado: ${data.nome}`);

    return data.ficha || result.insertId;
  },

  // Buscar todos os assistidos
  async findAll(usuario) {
    const query = "SELECT * FROM assistidos";
    const [rows] = await connection.query(query);
    await Audit.log(usuario, "READ", "Listagem de todos os assistidos");
    return rows;
  },

  // Buscar um assistido por ficha
  async findByFicha(ficha, usuario) {
    const query = "SELECT * FROM assistidos WHERE ficha = ?";
    const [rows] = await connection.query(query, [ficha]);

    if (rows.length === 0) {
      throw new Error("Assistido não encontrado.");
    }

    await Audit.log(usuario, "READ", `Consulta do assistido Ficha ${ficha}`);
    return rows[0];
  },

  // Atualizar um assistido com auditoria
  async update(ficha, data, executadoPor) {
    const antigo = await this.findByFicha(ficha, executadoPor);
    if (!antigo) return false;

    const query = `
      UPDATE assistidos SET 
        nome = ?, cpf = ?, celular = ?, cep = ?, rua = ?, numero = ?, bairro = ?, 
        cidade = ?, estado = ?, nascimento = ?, genero = ?, email = ?, 
        de_menor = ?, assistido_id = ?, cesta_basica = ?, 
        data_assistente_social = ?, anamnese = ?, 
        anexo_id = COALESCE(?, anexo_id), 
        anexo2_id = COALESCE(?, anexo2_id), 
        anexo3_id = COALESCE(?, anexo3_id) 
      WHERE ficha = ?
    `;
    
    const values = [
      data.nome, data.cpf, data.celular, data.cep, data.rua, data.numero, 
      data.bairro, data.cidade, data.estado, data.nascimento, 
      data.genero, data.email, data.de_menor, data.assistido_id, 
      data.cesta_basica, data.data_assistente_social, data.anamnese, 
      data.anexo_id, data.anexo2_id, data.anexo3_id, ficha
    ];

    const [result] = await connection.execute(query, values);
    if (result.affectedRows > 0) {
      await Audit.log(executadoPor, "UPDATE", `Assistido atualizado: ${data.nome}`);
    }
    return result.affectedRows > 0;
  },

  // Excluir um assistido com auditoria
  async delete(ficha, executadoPor) {
    const antigo = await this.findByFicha(ficha, executadoPor);
    if (!antigo) return false;

    const query = "DELETE FROM assistidos WHERE ficha = ?";
    const [result] = await connection.execute(query, [ficha]);
    if (result.affectedRows > 0) {
      await Audit.log(executadoPor, "DELETE", `Assistido Ficha ${ficha} excluído`);
    }
    return result.affectedRows > 0;
  },

  // Verificar se um CPF já existe
  async existsByCpf(cpf) {
    const query = "SELECT ficha FROM assistidos WHERE cpf = ?";
    const [rows] = await connection.query(query, [cpf]);
    return rows.length > 0;
  }
};

module.exports = Assistido;
