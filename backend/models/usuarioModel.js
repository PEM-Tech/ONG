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

    static async create(data) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO usuarios (nome, senha, desabilitado, funcao, anexo_id) VALUES (?, ?, ?, ?, ?)';
            const values = [data.nome, data.senha, data.desabilitado || 'não', data.funcao, data.anexo_id || null];
            connection.query(query, values, (err, results) => {
                if (err) return reject(err);
                resolve({ id: results.insertId, ...data });
            });
        });
    }

    static async update(id, data) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE usuarios
                SET nome = ?, senha = ?, desabilitado = ?, funcao = ?, anexo_id = ?
                WHERE id = ?
            `;
            const values = [data.nome, data.senha, data.desabilitado, data.funcao, data.anexo_id, id];
            connection.query(query, values, (err, results) => {
                if (err) return reject(err);
                if (results.affectedRows === 0) return reject(new Error('Usuário não encontrado'));
                resolve({ id, ...data });
            });
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM usuarios WHERE id = ?';
            connection.query(query, [id], (err, results) => {
                if (err) return reject(err);
                if (results.affectedRows === 0) return reject(new Error('Usuário não encontrado'));
                resolve({ message: 'Usuário deletado com sucesso' });
            });
        });
    }
}

module.exports = Usuario;
