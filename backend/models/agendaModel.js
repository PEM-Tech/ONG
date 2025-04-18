const connection = require("../config/database"); // Conexão com o banco de dados
const Audit = require("../models/auditModel"); // Modelo de auditoria

class Agenda {
    // 🔹 Buscar todos os agendamentos
    static async getAll(usuario) {
        try {
            const [results] = await connection.query(`
                SELECT a.id, a.title, a.data_hora, t.nome AS tipo_consulta, ass.ficha AS ficha_assistido, v.nome AS voluntario
                FROM agenda a
                JOIN tipos_consulta t ON a.tipo_consulta_id = t.id
                JOIN assistidos ass ON a.ficha_assistido = ass.ficha
                JOIN voluntarios v ON a.voluntario_id = v.id
                ORDER BY a.data_hora DESC
            `);

            // 🔹 Evita erro caso `usuario` seja `undefined`
            await Audit.log(usuario ?? "Sistema", "READ", "Listagem de todos os agendamentos");
            return results;
        } catch (err) {
            throw err;
        }
    }

    // 🔹 Buscar agendamento por ID
    static async getById(id, usuario) {
        try {
            const [results] = await connection.query(`
                SELECT a.id, a.title, a.data_hora, t.nome AS tipo_consulta, ass.ficha AS ficha_assistido, v.nome AS voluntario
                FROM agenda a
                JOIN tipos_consulta t ON a.tipo_consulta_id = t.id
                JOIN assistidos ass ON a.ficha_assistido = ass.ficha
                JOIN voluntarios v ON a.voluntario_id = v.id
                WHERE a.id = ?
            `, [id]);

            if (results.length === 0) {
                throw new Error("Agendamento não encontrado.");
            }

            await Audit.log(usuario ?? "Sistema", "READ", `Consulta de agendamento ID ${id}`);
            return results[0];
        } catch (err) {
            throw err;
        }
    }

    // 🔹 Criar um novo agendamento
    static async create(data, usuario) {
        try {
            const insertQuery = `
                INSERT INTO agenda (title, data_hora, tipo_consulta_id, ficha_assistido, voluntario_id) 
                VALUES (?, ?, ?, ?, ?)
            `;

            const [result] = await connection.query(insertQuery, [
                data.title,
                data.data_hora,
                data.tipo_consulta_id,
                data.ficha_assistido,
                data.voluntario_id
            ]);

            await Audit.log(usuario ?? "Sistema", "CREATE", `Agendamento criado: ${data.title} em ${data.data_hora}`);
            return { id: result.insertId, ...data };
        } catch (err) {
            throw err;
        }
    }

    // 🔹 Atualizar um agendamento
    static async update(id, data, usuario) {
        try {
            // Verifica se o agendamento existe
            const [agendaExists] = await connection.query("SELECT id FROM agenda WHERE id = ?", [id]);
            if (agendaExists.length === 0) {
                throw new Error("Agendamento não encontrado.");
            }

            const updateQuery = `
                UPDATE agenda 
                SET title = ?, data_hora = ?, tipo_consulta_id = ?, ficha_assistido = ?, voluntario_id = ?
                WHERE id = ?
            `;

            await connection.query(updateQuery, [
                data.title,
                data.data_hora,
                data.tipo_consulta_id,
                data.ficha_assistido,
                data.voluntario_id,
                id
            ]);

            await Audit.log(usuario ?? "Sistema", "UPDATE", `Agendamento atualizado: ${data.title} para ${data.data_hora}`);
            return { id, ...data };
        } catch (err) {
            throw err;
        }
    }

    // 🔹 Excluir um agendamento
    static async delete(id, usuario) {
        try {
            // Verifica se o agendamento existe antes de deletar
            const [agendaExists] = await connection.query("SELECT id FROM agenda WHERE id = ?", [id]);
            if (agendaExists.length === 0) {
                throw new Error("Agendamento não encontrado.");
            }

            await connection.query("DELETE FROM agenda WHERE id = ?", [id]);
            await Audit.log(usuario ?? "Sistema", "DELETE", `Agendamento ID ${id} excluído`);
            return { message: "Agendamento deletado com sucesso." };
        } catch (err) {
            throw err;
        }
    }
}

module.exports = Agenda;
