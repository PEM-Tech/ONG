const express = require("express");
const router = express.Router();
const { upload, criarAnexo, obterAnexoPorId } = require("../controllers/anexoController");

// Rota para upload de arquivos
router.post("/upload", upload.single("file"), criarAnexo);

// Rota para obter um anexo pelo ID
router.get("/:id", obterAnexoPorId);

module.exports = router;
