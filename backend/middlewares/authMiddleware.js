const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extrai o token do cabeçalho
    console.log("Authorization Header:", req.headers.authorization);


    if (!token) {
        console.log("🚫 Acesso negado! Token ausente.");
        return res.status(401).json({ error: "Acesso não autorizado. Token ausente!" });
    }

    jwt.verify(token, "secreta", (err, decoded) => {
        if (err) {
            console.log("⚠️ Token inválido!", err.message);
            return res.status(401).json({ error: "Token inválido!" });
        }

        req.usuario = decoded; // Salva os dados do usuário na requisição
        console.log("✅ Token validado com sucesso!", decoded);
        next();
    });
};

module.exports = verificarToken;
