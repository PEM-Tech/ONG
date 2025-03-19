const express = require("express");
const VoluntarioController = require("../controllers/voluntarioController");
const verificarToken = require("../middlewares/authMiddleware"); 
const multer = require("multer");
const path = require("path");

// 📌 Configuração do Multer (EXATAMENTE IGUAL AO ASSISTIDOS)
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

// 📌 Rotas protegidas por autenticação
const router = express.Router();

router.get("/voluntario/by-token", verificarToken, VoluntarioController.getVoluntarioById);
router.get("/buscar", verificarToken, VoluntarioController.getAllVoluntarios);
router.get("/buscar/:id", verificarToken, VoluntarioController.getVoluntarioById);

// 📌 Rota de criação com múltiplos anexos
router.post(
  "/criar",
  verificarToken,
  upload.fields([
    { name: "anexo_id", maxCount: 1 },
    { name: "anexo2_id", maxCount: 1 },
    { name: "anexo3_id", maxCount: 1 }
  ]),
  VoluntarioController.createVoluntario
);

// 📌 Atualizar voluntário (também permitindo anexos)
router.put(
  "/atualizar/:id",
  verificarToken,
  upload.fields([
    { name: "anexo_id", maxCount: 1 },
    { name: "anexo2_id", maxCount: 1 },
    { name: "anexo3_id", maxCount: 1 }
  ]),
  VoluntarioController.updateVoluntario
);

// 📌 Excluir voluntário
router.delete("/:id", verificarToken, VoluntarioController.deleteVoluntario);

module.exports = router;
