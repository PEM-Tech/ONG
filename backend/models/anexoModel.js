const db = require("../config/database"); // Configuração do banco de dados

// Função para salvar um anexo no banco de dados
const Anexo = async ({ nome, caminho, tamanho }) => {
  try {
    const query = `INSERT INTO anexos (nome, caminho, tamanho, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())`;
    const [result] = await db.execute(query, [nome, caminho, tamanho]);
    return { id: result.insertId, nome, caminho, tamanho };
  } catch (error) {
    throw new Error("Erro ao salvar anexo no banco de dados: " + error.message);
  }
};

// Função para buscar um anexo pelo ID
const buscarAnexoPorId = async (id) => {
  try {
    const query = `SELECT * FROM anexos WHERE id = ?`;
    const [rows] = await db.execute(query, [id]); // Garante retorno correto

    if (!rows || rows.length === 0) {
      console.log("Nenhum anexo encontrado para o ID:", id);
      return null;
    }

    console.log("✅ Anexo encontrado:", rows[0]); // Debug para ver o que retorna

    return rows[0]; // Retorna o anexo encontrado
  } catch (error) {
    console.error("🚨 Erro ao buscar anexo:", error.message);
    return null;
  }
};





module.exports = { Anexo, buscarAnexoPorId };
