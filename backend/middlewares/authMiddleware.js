const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("🔹 Authorization Header Recebido:", authHeader);

    if (!authHeader) {
        console.log("🚫 Acesso negado! Token ausente.");
        return res.status(401).json({ error: "Acesso não autorizado. Token ausente!" });
    }

    const token = authHeader.split(" ")[1]; // Extrai apenas o token (sem "Bearer")

    jwt.verify(token, "secreta", (err, decoded) => {
        if (err) {
            console.log("⚠️ Token inválido! Erro:", err.message);
            return res.status(401).json({ error: "Token inválido!" });
        }

        req.user = decoded; // Ajustado para `req.user` (padrão do sistema)
        console.log("✅ Token validado com sucesso! Usuário:", decoded.nome || decoded.email);
        next();
    });
};

module.exports = verificarToken;
