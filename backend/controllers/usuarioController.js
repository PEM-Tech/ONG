const Usuario = require('../models/usuarioModel.js');

class UsuarioController {
    async getAllUsuarios(req, res) {
        try {
            const usuarios = await Usuario.getAll();
            res.status(200).json(usuarios);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getUsuarioById(req, res) {
        try {
            const { id } = req.params;
            const usuario = await Usuario.getById(id);
            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            res.status(200).json(usuario);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createUsuario(req, res) {
        try {
            const usuarioData = req.body;
            const novoUsuario = await Usuario.create(usuarioData);
            res.status(201).json(novoUsuario);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateUsuario(req, res) {
        try {
            const { id } = req.params;
            const usuarioData = req.body;
            const usuarioAtualizado = await Usuario.update(id, usuarioData);
            res.status(200).json(usuarioAtualizado);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async deleteUsuario(req, res) {
        try {
            const { id } = req.params;
            const resultado = await Usuario.delete(id);
            res.status(200).json(resultado);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}

module.exports = new UsuarioController();
