const express = require("express");
const VoluntarioController = require("../controllers/voluntarioController");
const verificarToken = require("../middlewares/authMiddleware"); // Middleware de autenticação
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });


const router = express.Router();

// 🛡 Rotas protegidas pelo token
router.get("/voluntario/by-token", verificarToken, VoluntarioController.getVoluntarioById);
router.get("/buscar", verificarToken, VoluntarioController.getAllVoluntarios);
router.get("/buscar/:id", verificarToken, VoluntarioController.getVoluntarioById);
router.post("/criar", verificarToken, upload.single("anexo_id"), VoluntarioController.createVoluntario);
router.put("/atualizar/:id", verificarToken, upload.single("anexo_id"), VoluntarioController.updateVoluntario);
router.delete("/:id", verificarToken, VoluntarioController.deleteVoluntario);


module.exports = router;
