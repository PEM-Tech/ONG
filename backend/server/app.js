const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config(); // Carrega as variáveis do .env
const connection = require('../config/database');
const fs = require('fs');
const usuarioRoutes = require('../routes/usuarioRoutes'); // Importa as rotas de usuários

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Configuração do CORS
const corsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',')
  : ['*']; // Aceita qualquer origem, caso não esteja configurado no .env
app.use(cors({
  origin: corsOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Logger básico de requisições
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Cria a pasta 'uploads' se não existir
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware para servir arquivos estáticos
app.use('/uploads', express.static(uploadsDir));

// Rotas
app.use('/usuarios', usuarioRoutes); // Adiciona as rotas de usuários

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});



// Configuração do multer para salvar na pasta "uploads"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "uploads")); // Pasta onde os arquivos serão salvos
  },
  filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname)); // Garante nomes únicos
  },
});

const upload = multer({ storage });

// Rota de upload
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado." });
  }

  // Retorna informações do arquivo
  res.json({
      caminho: `../uploads/${req.file.filename}`, // Caminho do arquivo
      tamanho: req.file.size, // Tamanho do arquivo
      nome: req.file.originalname, // Nome original do arquivo
  });
});