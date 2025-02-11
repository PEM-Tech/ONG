// backend/routes/assistidos.routes.js
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const multer = require("multer");
const assistidosController = require("../controllers/assistidos.controller");
const verificarToken = require("../middlewares/authMiddleware");
const path = require("path");

// Configuração do Multer (exemplo)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, "../server/uploads");
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      return cb(null, true);
    }
    cb(new Error("Formato de arquivo inválido. Apenas PDF, JPG e PNG são permitidos."));
  }
});

// Exemplo de validação com express-validator
const validations = [
  body("nome").isLength({ min: 3 }).withMessage("Nome deve ter pelo menos 3 caracteres."),
  // Outras validações...
];

// Aplica o middleware de autenticação na rota
router.post(
  "/",
  verificarToken, // Middleware de autenticação
  upload.fields([
    { name: "anexo_id", maxCount: 1 },
    { name: "anexo2_id", maxCount: 1 },
    { name: "anexo3_id", maxCount: 1 }
  ]),
  validations,
  assistidosController.createAssistido
);
router.get("/", verificarToken, assistidosController.listAssistidos);

module.exports = router;
