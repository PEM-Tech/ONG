const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { Anexo, buscarAnexoPorId } = require("../models/anexoModel.js");

// Configuração do multer para salvar arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "server", "uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Criar anexo
const criarAnexo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado." });
    }

    const { originalname, filename, size } = req.file;
    const caminhoRelativo = `uploads/${filename}`; // ⬅️ Caminho relativo

    const anexo = await Anexo({
      nome: originalname,
      caminho: caminhoRelativo,
      tamanho: size,
    });

    res.status(201).json(anexo);
  } catch (error) {
    console.error("Erro ao criar anexo:", error);
    res.status(500).json({ error: "Erro ao salvar anexo." });
  }
};

// Obter anexo
const obterAnexoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const anexo = await buscarAnexoPorId(id);

    if (!anexo) {
      return res.status(404).json({ error: "Anexo não encontrado." });
    }

    const filePath = path.join(__dirname, "..", "server", anexo.caminho);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Arquivo não encontrado no disco." });
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error("Erro ao obter anexo:", error);
    res.status(500).json({ error: "Erro ao buscar anexo." });
  }
};

module.exports = {
  upload,
  criarAnexo,
  obterAnexoPorId,
};
