const db = require('../config/database');
const Audit = require("../models/auditModel");

// Listar todos os tipos de consulta
exports.getAllTiposConsulta = (req, res) => {
    const usuarioLogado = req.user?.nome || req.user?.email || "Desconhecido";

    const sql = 'SELECT * FROM tipos_consulta';
    db.query(sql, async (err, results) => {
        if (err) {
            console.error("❌ Erro ao buscar tipos de consulta:", err);
            return res.status(500).json({ error: err.message });
        }

        await Audit.log(usuarioLogado, "READ", "Listagem de todos os tipos de consulta");
        res.json(results);
    });
};

// Buscar um tipo de consulta pelo ID
exports.getTipoConsultaById = (req, res) => {
    const { id } = req.params;
    const usuarioLogado = req.user?.nome || req.user?.email || "Desconhecido";

    const sql = 'SELECT * FROM tipos_consulta WHERE id = ?';
    db.query(sql, [id], async (err, result) => {
        if (err) {
            console.error("❌ Erro ao buscar tipo de consulta:", err);
            return res.status(500).json({ error: err.message });
        }
        if (result.length === 0) return res.status(404).json({ message: 'Tipo de consulta não encontrado' });

        await Audit.log(usuarioLogado, "READ", `Consulta do tipo de consulta ID ${id}`);
        res.json(result[0]);
    });
};

// Criar um novo tipo de consulta
exports.createTipoConsulta = (req, res) => {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ message: 'O nome é obrigatório' });

    const usuarioLogado = req.user?.nome || req.user?.email || "Desconhecido";

    const sql = 'INSERT INTO tipos_consulta (nome) VALUES (?)';
    db.query(sql, [nome], async (err, result) => {
        if (err) {
            console.error("❌ Erro ao criar tipo de consulta:", err);
            return res.status(500).json({ error: err.message });
        }

        await Audit.log(usuarioLogado, "CREATE", `Tipo de consulta criado: ${nome}`);
        res.status(201).json({ id: result.insertId, nome });
    });
};

// Atualizar um tipo de consulta
exports.updateTipoConsulta = (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ message: 'O nome é obrigatório' });

    const usuarioLogado = req.user?.nome || req.user?.email || "Desconhecido";

    const sql = 'UPDATE tipos_consulta SET nome = ? WHERE id = ?';
    db.query(sql, [nome, id], async (err, result) => {
        if (err) {
            console.error("❌ Erro ao atualizar tipo de consulta:", err);
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Tipo de consulta não encontrado' });

        await Audit.log(usuarioLogado, "UPDATE", `Tipo de consulta atualizado: ${nome}`);
        res.json({ id, nome });
    });
};

// Excluir um tipo de consulta
exports.deleteTipoConsulta = (req, res) => {
    const { id } = req.params;
    const usuarioLogado = req.user?.nome || req.user?.email || "Desconhecido";

    const sql = 'DELETE FROM tipos_consulta WHERE id = ?';
    db.query(sql, [id], async (err, result) => {
        if (err) {
            console.error("❌ Erro ao excluir tipo de consulta:", err);
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Tipo de consulta não encontrado' });

        await Audit.log(usuarioLogado, "DELETE", `Tipo de consulta ID ${id} excluído`);
        res.json({ message: 'Tipo de consulta excluído com sucesso' });
    });
};
