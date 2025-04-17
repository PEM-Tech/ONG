const { validationResult } = require("express-validator");
const connection = require("../config/database");
const Audit = require("../models/auditModel");

// Função auxiliar para tratar valores antes de inserir no banco
function tratarValor(value) {
  return value === undefined || value === "" ? null : value;
}

// Função auxiliar para inserir anexo na tabela "anexos"
async function inserirAnexo(file) {
  if (!file) return null;
  const query = `INSERT INTO anexos (nome, tamanho, path) VALUES (?, ?, ?)`;
  const values = [file.originalname, file.size, file.path];
  const [result] = await connection.execute(query, values);
  return result.insertId;
}

// Criar um novo assistido
exports.createAssistido = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const usuarioLogado = req.user?.nome || req.user?.email || "Desconhecido";

    const {
      ficha, nome, cpf, celular, cep, rua, numero, bairro, cidade, estado, nascimento,
      genero, email, de_menor, assistido_id, cesta_basica, data_assistente_social, anamnese
    } = req.body;

    // Validação: verifica se o CPF já está cadastrado
    if (cpf) {
      const checkCpfQuery = "SELECT ficha FROM assistidos WHERE cpf = ?";
      const [cpfRows] = await connection.execute(checkCpfQuery, [cpf]);
      if (cpfRows.length > 0) {
        return res.status(400).json({ error: "CPF já cadastrado" });
      }
    }

    // Processamento de anexos
    const files = req.files;
    let anexo_id = await inserirAnexo(files?.anexo_id?.[0]);
    let anexo2_id = await inserirAnexo(files?.anexo2_id?.[0]);
    let anexo3_id = await inserirAnexo(files?.anexo3_id?.[0]);

    // Query de inserção
    const query = `
      INSERT INTO assistidos 
      (ficha, nome, cpf, celular, cep, rua, numero, bairro, cidade, estado, nascimento, genero, email, 
       de_menor, assistido_id, cesta_basica, data_assistente_social, anamnese, anexo_id, anexo2_id, anexo3_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      tratarValor(ficha), tratarValor(nome), tratarValor(cpf), tratarValor(celular), tratarValor(cep), tratarValor(rua),
      tratarValor(numero), tratarValor(bairro), tratarValor(cidade), tratarValor(estado), tratarValor(nascimento),
      tratarValor(genero), tratarValor(email), tratarValor(de_menor), tratarValor(assistido_id),
      tratarValor(cesta_basica), tratarValor(data_assistente_social), tratarValor(anamnese),
      tratarValor(anexo_id), tratarValor(anexo2_id), tratarValor(anexo3_id)
    ];

    await connection.execute(query, values);

    // Registrar na auditoria
    await Audit.log(usuarioLogado, "CREATE", `Assistido criado: ${nome}`);

    res.status(201).json({ message: "Assistido cadastrado com sucesso!" });
  } catch (error) {
    console.error("❌ Erro ao cadastrar assistido:", error);
    res.status(500).json({ error: "Erro ao cadastrar assistido. Tente novamente mais tarde." });
  }
};

// Atualizar um assistido
exports.updateAssistido = async (req, res) => {
  try {
    const ficha = req.params.ficha;
    const usuarioLogado = req.user?.nome || req.user?.email || "Desconhecido";

    const {
      nome, cpf, celular, cep, rua, numero, bairro, cidade, estado, nascimento, genero, email,
      de_menor, assistido_id, cesta_basica, data_assistente_social, anamnese
    } = req.body;

    // Processamento de anexos
    const files = req.files;
    let anexo_id = await inserirAnexo(files?.anexo_id?.[0]);
    let anexo2_id = await inserirAnexo(files?.anexo2_id?.[0]);
    let anexo3_id = await inserirAnexo(files?.anexo3_id?.[0]);

    // Query de atualização
    const query = `
      UPDATE assistidos SET 
        nome = ?, cpf = ?, celular = ?, cep = ?, rua = ?, numero = ?, bairro = ?, cidade = ?, estado = ?, 
        nascimento = ?, genero = ?, email = ?, de_menor = ?, assistido_id = ?, cesta_basica = ?, 
        data_assistente_social = ?, anamnese = ?, anexo_id = COALESCE(?, anexo_id), 
        anexo2_id = COALESCE(?, anexo2_id), anexo3_id = COALESCE(?, anexo3_id)
      WHERE ficha = ?
    `;
    const values = [
      tratarValor(nome), tratarValor(cpf), tratarValor(celular), tratarValor(cep), tratarValor(rua), tratarValor(numero),
      tratarValor(bairro), tratarValor(cidade), tratarValor(estado), tratarValor(nascimento),
      tratarValor(genero), tratarValor(email), tratarValor(de_menor), tratarValor(assistido_id),
      tratarValor(cesta_basica), tratarValor(data_assistente_social), tratarValor(anamnese),
      tratarValor(anexo_id), tratarValor(anexo2_id), tratarValor(anexo3_id), ficha
    ];

    await connection.execute(query, values);

    // Registrar na auditoria
    await Audit.log(usuarioLogado, "UPDATE", `Assistido atualizado: ${nome}`);

    res.status(200).json({ message: "Assistido atualizado com sucesso!" });
  } catch (error) {
    console.error("❌ Erro ao atualizar assistido:", error);
    res.status(500).json({ error: "Erro ao atualizar assistido. Tente novamente mais tarde." });
  }
};

// Deletar um assistido
exports.deleteAssistido = async (req, res) => {
  try {
    const ficha = req.params.ficha;
    const usuarioLogado = req.user?.nome || req.user?.email || "Desconhecido";

    await connection.query("DELETE FROM assistidos WHERE ficha = ?", [ficha]);

    // Registrar na auditoria
    await Audit.log(usuarioLogado, "DELETE", `Assistido ID ${ficha} excluído`);

    res.status(200).json({ message: "Assistido excluído com sucesso!" });
  } catch (error) {
    console.error("❌ Erro ao excluir assistido:", error);
    res.status(500).json({ error: "Erro ao excluir assistido. Tente novamente mais tarde." });
  }
};
// Listar todos os assistidos
exports.listAssistidos = async (req, res) => {
  try {
      const [rows] = await connection.query("SELECT * FROM assistidos");
      res.status(200).json(rows);
  } catch (error) {
      console.error("❌ Erro ao listar assistidos:", error);
      res.status(500).json({ error: "Erro ao listar assistidos." });
  }
};

// Buscar um assistido específico
exports.getAssistido = async (req, res) => {
  try {
      const { ficha } = req.params;
      const [rows] = await connection.query("SELECT * FROM assistidos WHERE ficha = ?", [ficha]);

      if (rows.length === 0) {
          return res.status(404).json({ error: "Assistido não encontrado." });
      }

      res.status(200).json(rows[0]);
  } catch (error) {
      console.error("❌ Erro ao buscar assistido:", error);
      res.status(500).json({ error: "Erro ao buscar assistido." });
  }
};
