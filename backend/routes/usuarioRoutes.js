const express = require("express");
const UsuarioController = require("../controllers/usuarioController");
const verificarToken = require("../middlewares/authMiddleware"); // Importa o middleware

const router = express.Router();

router.post("/login", UsuarioController.loginUsuario); // Login não precisa de autenticação

// 🔹 Nova rota para restaurar a sessão do usuário com base no token
router.get("/me", UsuarioController.getUsuarioByToken);

// 🛡 Rotas protegidas pelo token
router.get('/usuario/by-token', UsuarioController.getUsuarioByToken);
router.get("/buscar", UsuarioController.getAllUsuarios);
router.get("/buscar/:id", UsuarioController.getUsuarioById);
router.post("/criar", UsuarioController.createUsuario);
router.put("/atualizar/:id", UsuarioController.updateUsuario);
router.delete("/deletar/:id", UsuarioController.deleteUsuario);

module.exports = router;
