const express = require('express');
const UsuarioController = require('../controllers/usuarioController.js'); // Certifique-se de que esse arquivo existe

const router = express.Router();

// Rota para buscar todos os usuários
router.get('/buscar', UsuarioController.getAllUsuarios);

// Rota para buscar um usuário específico pelo ID
router.get('/buscar/:id', UsuarioController.getUsuarioById);

// Rota para criar um novo usuário
router.post('/criar', UsuarioController.createUsuario);

// Rota para atualizar um usuário existente pelo ID
router.put('/atualizar/:id', UsuarioController.updateUsuario);

// Rota para deletar um usuário pelo ID
router.delete('/deletar/:id', UsuarioController.deleteUsuario);

module.exports = router;
