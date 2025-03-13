const express = require("express");
const UsuarioController = require("../controllers/usuarioController");
const verificarToken = require("../middlewares/authMiddleware");

console.log("🛠 Métodos disponíveis no UsuarioController:", Object.keys(UsuarioController)); // Depuração

const router = express.Router();

// 🔥 Teste se cada função existe antes de usá-la
if (UsuarioController.loginUsuario) {
    router.post("/login", UsuarioController.loginUsuario);
} else {
    console.error("❌ ERRO: loginUsuario não foi encontrado no UsuarioController!");
}

if (UsuarioController.getAllUsuarios) {
    router.get("/buscar", verificarToken, UsuarioController.getAllUsuarios);
} else {
    console.error("❌ ERRO: getAllUsuarios não foi encontrado no UsuarioController!");
}

if (UsuarioController.getUsuarioById) {
    router.get("/buscar/:id", verificarToken, UsuarioController.getUsuarioById);
} else {
    console.error("❌ ERRO: getUsuarioById não foi encontrado no UsuarioController!");
}

if (UsuarioController.createUsuario) {
    router.post("/criar", verificarToken, UsuarioController.createUsuario);
} else {
    console.error("❌ ERRO: createUsuario não foi encontrado no UsuarioController!");
}

if (UsuarioController.updateUsuario) {
    router.put("/atualizar/:id", verificarToken, UsuarioController.updateUsuario);
} else {
    console.error("❌ ERRO: updateUsuario não foi encontrado no UsuarioController!");
}

if (UsuarioController.deleteUsuario) {
    router.delete("/deletar/:id", verificarToken, UsuarioController.deleteUsuario);
} else {
    console.error("❌ ERRO: deleteUsuario não foi encontrado no UsuarioController!");
}

module.exports = router;
