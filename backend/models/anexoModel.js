const db = require("../config/database"); // Configuração do banco de dados

// Função para salvar um anexo no banco de dados
const salvarAnexo = async ({ nome, caminho, tamanho }) => {
    try {
        const query = `INSERT INTO anexos (nome, caminho, tamanho, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())`;
        const [result] = await db.execute(query, [nome, caminho, tamanho]);
        return { id: result.insertId, nome, caminho, tamanho };
    } catch (error) {
        throw new Error("Erro ao salvar anexo no banco de dados: " + error.message);
    }
};

module.exports = { salvarAnexo };