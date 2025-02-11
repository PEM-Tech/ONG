
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
  if (!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Extração dos dados do req.body, com fallback para null
    const nome = req.body.nome || null;
    const cpf = req.body.cpf || null;
    const celular = req.body.celular || null;
    const cep = req.body.cep || null;
    const numero = req.body.numero || null;
    const bairro = req.body.bairro || null;
    const cidade = req.body.cidade || null;
    const estado = req.body.estado || null;
    const nascimento = req.body.nascimento || null;
    const genero = req.body.genero || null;
    const email = req.body.email || null;
    
    // Para os campos ENUM: converte "nao" para "não" se necessário
    const deMenorValor = (req.body.de_menor === "nao" ? "não" : req.body.de_menor) || null;
    const cestaBasicaValor = (req.body.cesta_basica === "nao" ? "não" : req.body.cesta_basica) || null;
    
    // Observe que o front provavelmente envia "parentesco" (em minúsculas)
    const parentesco = req.body.parentesco || null;
    
    const data_assistente_social = req.body.data_assistente_social || null;
    const anamnese = req.body.anamnese || null;

    // Processa os arquivos enviados via multer
    const files = req.files;
    let anexo_id = null, anexo2_id = null, anexo3_id = null;
    if (files?.anexo_id && files.anexo_id.length > 0) {
      anexo_id = await inserirAnexo(files.anexo_id[0]);
    }
    if (files?.anexo2_id && files.anexo2_id.length > 0) {
      anexo2_id = await inserirAnexo(files.anexo2_id[0]);
    }
    if (files?.anexo3_id && files.anexo3_id.length > 0) {
      anexo3_id = await inserirAnexo(files.anexo3_id[0]);
    }

    // Query de inserção na tabela "assistidos"
    const query = `
      INSERT INTO assistidos 
      (nome, cpf, celular, cep, numero, bairro, cidade, estado, nascimento, genero, email, de_menor, Parentesto, cesta_basica, data_assistente_social, anamnese, anexo_id, anexo2_id, anexo3_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      nome,
      cpf,
      celular,
      cep,
      numero,
      bairro,
      cidade,
      estado,
      nascimento,
      genero,
      email,
      deMenorValor,
      parentesco,
      cestaBasicaValor,
      data_assistente_social,
      anamnese,
      anexo_id,
      anexo2_id,
      anexo3_id
    ];

    const [result] = await connection.promise().execute(query, values);

    // Prepara os dados novos para a auditoria
    const novosDados = {
      nome,
      cpf,
      celular,
      cep,
      numero,
      bairro,
      cidade,
      estado,
      nascimento,
      genero,
      email,
      de_menor: deMenorValor,
      Parentesto: parentesco,
      cesta_basica: cestaBasicaValor,
      data_assistente_social,
      anamnese,
      anexo_id,
      anexo2_id,
      anexo3_id
    };

    // Formata a data para o padrão MySQL: 'YYYY-MM-DD HH:MM:SS'
    const dataHora = new Date().toISOString().slice(0, 19).replace("T", " ");
    // Obtém o ID do usuário logado a partir do middleware de autenticação
    const executadoPor = req.usuario && req.usuario.id ? req.usuario.id : null;

    // Query de inserção na tabela "audit"
    const auditQuery = `
      INSERT INTO audit (tabela, id_registro, acao, dados_anteriores, dados_novos, executado_por, data_hora)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const auditValues = [
      "assistidos",             // tabela
      result.insertId,          // id_registro
      "insert",                 // ação
      null,                     // dados_anteriores (nulo para insert)
      JSON.stringify(novosDados), // dados_novos
      executadoPor,             // executado_por (ID do usuário logado)
      dataHora                  // data_hora formatada
    ];
    await connection.promise().execute(auditQuery, auditValues);

    res.status(201).json({ message: "Assistido cadastrado com sucesso!", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao cadastrar assistido. Tente novamente mais tarde." });
  }
};

// Função para listar os assistidos
exports.listAssistidos = async (req, res) => {
  try {
    // Seleciona todos os registros da tabela "assistidos"
    const [rows] = await connection.promise().query("SELECT * FROM assistidos");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erro ao listar assistidos:", error);
    res.status(500).json({ error: "Erro ao buscar assistidos." });
  }
};
