const express = require("express");
const router = express.Router();
const agendaController = require("../controllers/agendaController");
const authMiddleware = require("../middlewares/authMiddleware"); // Middleware para verificar o Token

// 🔹 Buscar todas as consultas
router.get("/", authMiddleware, agendaController.getAllAgendas);

// 🔹 Criar uma nova consulta
router.post("/", authMiddleware, agendaController.createAgenda);

// 🔹 Buscar consulta por ID
router.get("/:id", authMiddleware, agendaController.getAgendaById);

// 🔹 Atualizar consulta
router.put("/:id", authMiddleware, agendaController.updateAgenda);

// 🔹 Excluir consulta
router.delete("/:id", authMiddleware, agendaController.deleteAgenda);

module.exports = router;
