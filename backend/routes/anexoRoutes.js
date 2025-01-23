const express = require("express");
const router = express.Router();
const { upload, criarAnexo } = require("../controllers/anexoController");

// Rota para upload de arquivos
router.post("/upload", upload.single("file"), criarAnexo);

module.exports = router;