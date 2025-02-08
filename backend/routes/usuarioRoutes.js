const express = require("express");
const UsuarioController = require("../controllers/usuarioController");
const verificarToken = require("../middlewares/authMiddleware"); // Importa o middleware

const router = express.Router();

router.post("/login", UsuarioController.loginUsuario); // Login não precisa de autenticação

// 🔹 Nova rota para restaurar a sessão do usuário com base no token
router.get("/me", verificarToken, UsuarioController.getUsuarioLogado);

// 🛡 Rotas protegidas pelo token
router.get("/buscar", verificarToken, UsuarioController.getAllUsuarios);
router.get("/buscar/:id", verificarToken, UsuarioController.getUsuarioById);
router.post("/criar", verificarToken, UsuarioController.createUsuario);
router.put("/atualizar/:id", verificarToken, UsuarioController.updateUsuario);
router.delete("/deletar/:id", verificarToken, UsuarioController.deleteUsuario);

module.exports = router;
