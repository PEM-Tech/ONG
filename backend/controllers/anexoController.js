const path = require("path");
const multer = require("multer");
const { salvarAnexo } = require("../models/Anexo");

// Configuração do multer para salvar arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads")); // Pasta onde os arquivos serão salvos
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Garante nomes únicos
    },
});

const upload = multer({ storage });

// Função para criar um novo anexo
const criarAnexo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Nenhum arquivo enviado." });
        }

        const { originalname, filename, size } = req.file;
        const caminho = `uploads/${filename}`;

        // Salvar informações no banco de dados
        const anexo = await salvarAnexo({
            nome: originalname,
            caminho,
            tamanho: size,
        });

        res.status(201).json(anexo);
    } catch (error) {
        console.error("Erro ao criar anexo:", error);
        res.status(500).json({ error: "Erro ao salvar anexo." });
    }
};

module.exports = {
    upload,
    criarAnexo,
};
