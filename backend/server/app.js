const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config(); // 🔹 Carrega as variáveis de ambiente
const connection = require("../config/database");
const fs = require("fs");
const usuarioRoutes = require("../routes/usuarioRoutes");
const anexoRoutes = require("../routes/anexoRoutes");
const path = require("path");
const assistidosRoutes = require("../routes/assistidosRoutes");
const voluntarioRoutes = require("../routes/voluntarioRoutes");

const app = express();

// Middleware para parsear JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 🔹 Adiciona o middleware para processar cookies
app.use(cookieParser());

// 🔹 Converte a variável de ambiente para array (se houver múltiplas origens)
const allowedOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : [];

// 🔹 Configuração do CORS
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // 🔹 Permite envio de cookies
}));

// Logger básico de requisições
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});

// Cria a pasta 'uploads' se não existir
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware para servir arquivos estáticos
app.use("/uploads", express.static(uploadsDir));

// Rotas
app.use("/usuarios", usuarioRoutes);
app.use("/anexos", anexoRoutes);
app.use('/api/assistidos', assistidosRoutes);
app.use('/api/voluntarios', voluntarioRoutes);

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
