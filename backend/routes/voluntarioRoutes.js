const express = require("express");
const VoluntarioController = require("../controllers/voluntarioController");
const verificarToken = require("../middlewares/authMiddleware"); // Middleware de autenticação

const router = express.Router();

// 🛡 Rotas protegidas pelo token
router.get("/voluntario/by-token", verificarToken, VoluntarioController.getVoluntarioById);
router.get("/buscar", verificarToken, VoluntarioController.getAllVoluntarios);
router.get("/buscar/:id", verificarToken, VoluntarioController.getVoluntarioById);
router.post("/criar", verificarToken, VoluntarioController.createVoluntario);
router.put("/atualizar/:id", verificarToken, VoluntarioController.updateVoluntario);
router.delete("/deletar/:id", verificarToken, VoluntarioController.deleteVoluntario);

module.exports = router;
