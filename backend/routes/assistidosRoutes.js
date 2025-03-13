// backend/routes/assistidos.routes.js
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const multer = require("multer");
const assistidosController = require("../controllers/assistidosController");
const verificarToken = require("../middlewares/authMiddleware");
const path = require("path");

console.log("🛠 Métodos disponíveis no assistidosController:", Object.keys(assistidosController));


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
]
router.get('/cep/:cep', async (req, res) => {
  try {
    const cep = req.params.cep;
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o CEP' });
  }
});
// Rota para criar um assistido (POST)
router.post(
  "/",
  verificarToken,
  upload.fields([
    { name: "anexo_id", maxCount: 1 },
    { name: "anexo2_id", maxCount: 1 },
    { name: "anexo3_id", maxCount: 1 }
  ]),
  validations,
  assistidosController.createAssistido
);


// Rota para listar assistidos (GET)
router.get("/", verificarToken, assistidosController.listAssistidos);

// Rota para buscar um assistido específico (GET)
router.get("/:ficha", verificarToken, assistidosController.getAssistido);

// Rota para atualizar um assistido (PUT)
router.put(
  "/:ficha",
  verificarToken,
  upload.fields([
    { name: "anexo_id", maxCount: 1 },
    { name: "anexo2_id", maxCount: 1 },
    { name: "anexo3_id", maxCount: 1 }
  ]),
  validations,
  assistidosController.updateAssistido
);

// **Rota para excluir um assistido (DELETE)**
router.delete("/:ficha", verificarToken, assistidosController.deleteAssistido);

module.exports = router;
