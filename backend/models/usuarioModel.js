const connection = require('../config/database'); // Importa a conexão com o banco de dados

class Usuario {
    // Buscar todos os usuários
    static async getAll() {
        try {
            const [results] = await connection.promise().query('SELECT * FROM usuarios');
            return results;
        } catch (err) {
            throw err;
        }
    }

    // Buscar usuário por ID
    static async getById(id) {
        try {
            const [results] = await connection.promise().query('SELECT * FROM usuarios WHERE id = ?', [id]);
            return results.length > 0 ? results[0] : null;
        } catch (err) {
            throw err;
        }
    }

    // Criar novo usuário
    static async create(data) {
        try {
            // Verifica se o email já existe
            const [emailExiste] = await connection.promise().query("SELECT id FROM usuarios WHERE email = ?", [data.email]);
            if (emailExiste.length > 0) {
                throw new Error("O email já está cadastrado.");
            }

            // Query para inserir usuário
            const insertQuery = `
                INSERT INTO usuarios (nome, email, senha, desabilitado, permissao) 
                VALUES (?, ?, ?, ?, ?)
            `;
            const [result] = await connection.promise().query(insertQuery, [
                data.nome,
                data.email,
                data.senha,  // Sem bcrypt (pode ser implementado no futuro)
                data.desabilitado,
                data.permissao
            ]);

            return { id: result.insertId, ...data };
        } catch (err) {
            throw err;
        }
    }

    // Atualizar um usuário
    static async update(id, data) {
        try {
            // Verifica se o usuário existe
            const [userExists] = await connection.promise().query("SELECT id FROM usuarios WHERE id = ?", [id]);
            if (userExists.length === 0) {
                throw new Error("Usuário não encontrado.");
            }

            // Criação da query dinâmica (senha só é alterada se for enviada)
            let query = `UPDATE usuarios SET nome = ?, email = ?, desabilitado = ?, permissao = ? WHERE id = ?`;
            let values = [data.nome, data.email, data.desabilitado, data.permissao, id];

            if (data.senha && data.senha.trim() !== "") {
                query = `UPDATE usuarios SET nome = ?, email = ?, senha = ?, desabilitado = ?, permissao = ? WHERE id = ?`;
                values = [data.nome, data.email, data.senha, data.desabilitado, data.permissao, id];
            }

            await connection.promise().query(query, values);
            return { id, ...data };
        } catch (err) {
            throw err;
        }
    }

    // Excluir usuário
    static async delete(id) {
        try {
            // Verifica se o usuário existe antes de deletar
            const [userExists] = await connection.promise().query("SELECT id FROM usuarios WHERE id = ?", [id]);
            if (userExists.length === 0) {
                throw new Error("Usuário não encontrado.");
            }

            await connection.promise().query("DELETE FROM usuarios WHERE id = ?", [id]);
            return { message: "Usuário deletado com sucesso." };
        } catch (err) {
            throw err;
        }
    }
}

module.exports = Usuario;
