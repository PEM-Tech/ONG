const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config(); // Carrega as variáveis do .env
const connection = require('../config/database');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Configuração do CORS
const corsOrigins = process.env.CORS_ORIGINS.split(','); // Divide as origens configuradas no .env
app.use(cors({
  origin: corsOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas




// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Logger básico de requisições
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});


            
         
    
    
  

