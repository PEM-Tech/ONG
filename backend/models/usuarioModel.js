const connection = require('../config/database'); // Importa a conexão com o banco de dados

class Usuario {
    static async getAll() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM usuarios';
            connection.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    static async getById(id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM usuarios WHERE id = ?';
            connection.query(query, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]); // Retorna apenas o primeiro resultado
            });
        });
    }

    static async create(data) {  // Agora `create` é `static`
        return new Promise((resolve, reject) => {
            // Verifica se o email já existe
            const checkEmailQuery = "SELECT id FROM usuarios WHERE email = ?";
            connection.query(checkEmailQuery, [data.email], (err, emailExiste) => {
                if (err) return reject(err);
                if (emailExiste.length > 0) {
                    return reject(new Error("O email já está cadastrado."));
                }

                // Query para inserir usuário no banco de dados
                const insertQuery = `
                    INSERT INTO usuarios (nome, email, senha, desabilitado, permissao) 
                    VALUES (?, ?, ?, ?, ?)
                `;

                connection.query(insertQuery, [
                    data.nome,
                    data.email,
                    data.senha,  // (OBS: Vamos implementar hash de senha no futuro)
                    data.desabilitado,
                    data.permissao
                ], (err, result) => {
                    if (err) return reject(err);
                    resolve({ id: result.insertId, ...data });
                });
            });
        });
    }
    static async update(id, data) {
        return new Promise((resolve, reject) => {
            // Verifica se o usuário existe antes de atualizar
            const checkUserQuery = "SELECT id FROM usuarios WHERE id = ?";
            connection.query(checkUserQuery, [id], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) {
                    return reject(new Error("Usuário não encontrado."));
                }
    
                const query = `
                    UPDATE usuarios
                    SET nome = ?, email = ?, senha = ?, desabilitado = ?, permissao = ?
                    WHERE id = ?
                `;
                const values = [data.nome, data.email, data.senha, data.desabilitado, data.permissao, id];
    
                connection.query(query, values, (err, results) => {
                    if (err) return reject(err);
                    resolve({ id, ...data });
                });
            });
        });
    }
    

    static async delete(id) {
        return new Promise((resolve, reject) => {
            // Verifica se o usuário existe
            const checkUserQuery = "SELECT id FROM usuarios WHERE id = ?";
            connection.query(checkUserQuery, [id], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) {
                    return reject(new Error("Usuário não encontrado."));
                }
    
                const query = "DELETE FROM usuarios WHERE id = ?";
                connection.query(query, [id], (err, results) => {
                    if (err) return reject(err);
                    resolve({ message: "Usuário deletado com sucesso." });
                });
            });
        });
    }
     }


module.exports = Usuario;
