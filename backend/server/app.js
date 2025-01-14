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
