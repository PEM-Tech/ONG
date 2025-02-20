const { validationResult } = require("express-validator");
const connection = require("../config/database");

// Função auxiliar para inserir arquivo na tabela "anexos"
async function inserirAnexo(file) {
  const query = `INSERT INTO anexos (nome, tamanho, path) VALUES (?, ?, ?)`;
  const values = [file.originalname, file.size, file.path];
  const [result] = await connection.promise().execute(query, values);
  return result.insertId;
}

exports.createAssistido = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Extração dos dados do req.body, com fallback para null
    const { id, nome, cpf, celular, cep, rua, numero, bairro, cidade, estado, nascimento, genero, email, data_assistente_social, anamnese } = req.body;
    
    const deMenorValor = req.body.de_menor === "nao" ? "não" : req.body.de_menor || null;
    const cestaBasicaValor = req.body.cesta_basica === "nao" ? "não" : req.body.cesta_basica || null;
    const parentesco = req.body.parentesco || null;

    // Validação: verifica se o CPF já está cadastrado
    if (cpf) {
      const checkCpfQuery = "SELECT id FROM assistidos WHERE cpf = ?";
      const [cpfRows] = await connection.promise().execute(checkCpfQuery, [cpf]);
      if (cpfRows.length > 0) {
        return res.status(400).json({ error: "CPF já cadastrado" });
      }
    }

    // Validação: verifica se o ID já existe (caso seja informado)
    if (id) {
      const checkIDQuery = "SELECT id FROM assistidos WHERE id = ?";
      const [idRows] = await connection.promise().execute(checkIDQuery, [id]);
      if (idRows.length > 0) {
        return res.status(400).json({ error: "Assistido com ID já existente" });
      }
    }

    // Processamento de anexos enviados via multer
    const files = req.files;
    let anexo_id = null, anexo2_id = null, anexo3_id = null;
    if (files?.anexo_id?.length) anexo_id = await inserirAnexo(files.anexo_id[0]);
    if (files?.anexo2_id?.length) anexo2_id = await inserirAnexo(files.anexo2_id[0]);
    if (files?.anexo3_id?.length) anexo3_id = await inserirAnexo(files.anexo3_id[0]);

    // Query de inserção
    const query = `
      INSERT INTO assistidos 
      (id, nome, cpf, celular, cep, rua, numero, bairro, cidade, estado, nascimento, genero, email, de_menor, parentesco, cesta_basica, data_assistente_social, anamnese, anexo_id, anexo2_id, anexo3_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [id, nome, cpf, celular, cep, rua, numero, bairro, cidade, estado, nascimento, genero, email, deMenorValor, parentesco, cestaBasicaValor, data_assistente_social, anamnese, anexo_id, anexo2_id, anexo3_id];

    const [result] = await connection.promise().execute(query, values);
    res.status(201).json({ message: "Assistido cadastrado com sucesso!", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao cadastrar assistido. Tente novamente mais tarde." });
  }
};

// Função para listar os assistidos
exports.listAssistidos = async (req, res) => {
  try {
    const [rows] = await connection.promise().query("SELECT * FROM assistidos");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erro ao listar assistidos:", error);
    res.status(500).json({ error: "Erro ao buscar assistidos." });
  }
};

// Função para atualizar um assistido
exports.updateAssistido = async (req, res) => {
  try {
    const id = req.params.id;
    const { nome, cpf, celular, cep, rua, numero, bairro, cidade, estado, nascimento, genero, email, de_menor, parentesco, cesta_basica, data_assistente_social, anamnese } = req.body;

    // Processamento de anexos
    let anexo_id = null, anexo2_id = null, anexo3_id = null;
    const files = req.files;
    if (files?.anexo_id?.length) anexo_id = await inserirAnexo(files.anexo_id[0]);
    if (files?.anexo2_id?.length) anexo2_id = await inserirAnexo(files.anexo2_id[0]);
    if (files?.anexo3_id?.length) anexo3_id = await inserirAnexo(files.anexo3_id[0]);

    // Query de atualização
    const query = `
      UPDATE assistidos SET 
        nome = ?, cpf = ?, celular = ?, cep = ?, rua = ?, numero = ?, bairro = ?, cidade = ?, estado = ?, nascimento = ?, genero = ?, email = ?, 
        de_menor = ?, parentesco = ?, cesta_basica = ?, data_assistente_social = ?, anamnese = ?, 
        anexo_id = COALESCE(?, anexo_id), anexo2_id = COALESCE(?, anexo2_id), anexo3_id = COALESCE(?, anexo3_id)
      WHERE id = ?
    `;
    const values = [nome, cpf, celular, cep, rua, numero, bairro, cidade, estado, nascimento, genero, email, de_menor, parentesco, cesta_basica, data_assistente_social, anamnese, anexo_id, anexo2_id, anexo3_id, id];

    await connection.promise().execute(query, values);
    res.status(200).json({ message: "Assistido atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar assistido:", error);
    res.status(500).json({ error: "Erro ao atualizar assistido. Tente novamente mais tarde." });
  }
};

// Função para deletar um assistido
exports.deleteAssistido = async (req, res) => {
  try {
    const id = req.params.id;

    // Verifica se o assistido existe
    const [rows] = await connection.promise().query("SELECT * FROM assistidos WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Assistido não encontrado" });
    }

    // Deleta o assistido
    await connection.promise().query("DELETE FROM assistidos WHERE id = ?", [id]);
    res.status(200).json({ message: "Assistido excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir assistido:", error);
    res.status(500).json({ error: "Erro ao excluir assistido. Tente novamente mais tarde." });
  }
};
