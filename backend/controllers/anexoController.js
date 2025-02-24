const path = require("path");
const multer = require("multer");
const { Anexo, buscarAnexoPorId } = require("../models/anexoModel.js");

// Configuração do multer para salvar arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../server/uploads")); // Pasta onde os arquivos serão salvos
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
        const anexo = await Anexo({
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

// Função para buscar um anexo pelo ID
const obterAnexoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const anexo = await buscarAnexoPorId(id);

        if (!anexo) {
            return res.status(404).json({ error: "Anexo não encontrado." });
        }

        // Caminho absoluto do arquivo
        const filePath = anexo.path;

        // Enviar o arquivo para o navegador
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error("Erro ao enviar o arquivo:", err);
                res.status(500).json({ error: "Erro ao abrir o arquivo." });
            }
        });
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
