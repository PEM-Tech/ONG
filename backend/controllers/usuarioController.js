const Usuario = require('../models/usuarioModel');
const connection = require("../config/database"); // Certifique-se de que a conexão está sendo importada
const jwt = require("jsonwebtoken");

class UsuarioController {

    async getAllUsuarios(req, res) {
        try {
            console.log("🔍 Buscando todos os usuários...");
            const usuarios = await Usuario.getAll();
            console.log("✅ Usuários encontrados:", usuarios);
            res.status(200).json(usuarios);
        } catch (error) {
            console.error("❌ Erro ao buscar usuários:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async getUsuarioById(req, res) {
        try {
            const { id } = req.params;
            console.log(`🔍 Buscando usuário com ID: ${id}`);
            const usuario = await Usuario.getById(id);
            if (!usuario) {
                console.log("⚠ Usuário não encontrado.");
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            console.log("✅ Usuário encontrado:", usuario);
            res.status(200).json(usuario);
        } catch (error) {
            console.error("❌ Erro ao buscar usuário:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async createUsuario(req, res) {
        try {
            console.log("📥 Recebendo dados no backend:", req.body);
            const { nome, email, senha, desabilitado, permissao } = req.body;

            if (!nome || !email || !senha) {
                console.log("⚠ Campos obrigatórios faltando.");
                return res.status(400).json({ error: "Nome, email e senha são obrigatórios." });
            }

            const novoUsuario = await Usuario.create(req.body);
            console.log("✅ Usuário cadastrado com sucesso:", novoUsuario);
            return res.status(201).json({
                message: "Usuário cadastrado com sucesso!",
                usuario: novoUsuario
            });

        } catch (error) {
            console.error("❌ Erro ao criar usuário:", error);
            if (error.message.includes("O email já está cadastrado")) {
                return res.status(409).json({ error: "Email já cadastrado. Tente outro." });
            }
            return res.status(500).json({ error: "Erro interno ao cadastrar usuário. " + error.message });
        }
    }

    async updateUsuario(req, res) {
        try {
            const { id } = req.params;
            const dadosAtualizados = req.body;
            console.log(`🔄 Atualizando usuário ID: ${id} Dados recebidos:`, dadosAtualizados);

            if (!dadosAtualizados.nome || !dadosAtualizados.email) {
                console.log("⚠ Nome e email são obrigatórios.");
                return res.status(400).json({ error: "Nome e email são obrigatórios." });
            }

            const usuarioAtualizado = await Usuario.update(id, dadosAtualizados);
            console.log("✅ Usuário atualizado:", usuarioAtualizado);
            res.status(200).json({ message: "Usuário atualizado com sucesso!", usuario: usuarioAtualizado });

        } catch (error) {
            console.error("❌ Erro ao atualizar usuário:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async deleteUsuario(req, res) {
        try {
            const { id } = req.params;
            console.log(`🗑 Excluindo usuário com ID: ${id}`);

            const resultado = await Usuario.delete(id);
            console.log("✅ Usuário excluído com sucesso:", resultado);
            res.status(200).json({ message: "Usuário deletado com sucesso!" });

        } catch (error) {
            console.error("❌ Erro ao deletar usuário:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async loginUsuario(req, res) {
        console.log("📥 Requisição recebida no backend:", req.body);
        const { email, senha } = req.body;
    
        try {
            const query = "SELECT * FROM usuarios WHERE email = ?";
            connection.query(query, [email], async (err, results) => {
                if (err) {
                    console.error("❌ Erro na consulta SQL:", err);
                    return res.status(500).json({ error: "Erro no servidor" });
                }
    
                if (results.length === 0) {
                    console.log("⚠️ Usuário não encontrado para o email:", email);
                    return res.status(401).json({ error: "Usuário não encontrado" });
                }
    
                const usuario = results[0];
    
                if (usuario.senha !== senha) {
                    console.log("⚠️ Senha incorreta para usuário:", usuario.email);
                    return res.status(401).json({ error: "Senha incorreta" });
                }
    
                console.log("✅ Login bem-sucedido para:", usuario.email);
    
                // 🔹 Gerar token JWT com nível de acesso
                const token = jwt.sign(
                    { id: usuario.id, email: usuario.email, permissao: usuario.permissao }, 
                    "secreta", 
                    { expiresIn: "1h" }
                );
    
                // 🔹 Salvar o token no banco de dados
                connection.query("UPDATE usuarios SET token = ? WHERE id = ?", [token, usuario.id]);
    
                res.json({ message: "Login bem-sucedido!", usuario, token });
            });
    
        } catch (error) {
            console.error("❌ Erro ao processar login:", error);
            res.status(500).json({ error: "Erro ao processar login" });
        }
    }

    async getUsuarioByToken(req, res) {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    
        if (!token) {
            return res.status(401).json({ error: "Token não fornecido" });
        }
    
        try {
            const decoded = jwt.verify(token, "secreta"); // Verifica o token
    
            const query = "SELECT * FROM usuarios WHERE id = ?";
            connection.query(query, [decoded.id], (err, results) => {
                if (err) {
                    console.error("❌ Erro na consulta SQL:", err);
                    return res.status(500).json({ error: "Erro no servidor" });
                }
    
                if (results.length === 0) {
                    console.log("⚠️ Usuário não encontrado.");
                    return res.status(404).json({ error: "Usuário não encontrado" });
                }
    
                console.log("✅ Sessão restaurada:", results[0]);
                res.json({ usuario: results[0] });
            });
        } catch (error) {
            console.error("❌ Token inválido ou expirado:", error);
            return res.status(401).json({ error: "Token inválido ou expirado" });
        }
    }
    
    async getUsuarioLogado(req, res) {
        try {
            const userId = req.usuario.id; // Obtém o ID do usuário decodificado do token
            console.log("🔍 Buscando usuário logado com ID:", userId);
    
            connection.query("SELECT id, nome, email, permissao FROM usuarios WHERE id = ?", [userId], (err, results) => {
                if (err) {
                    console.error("❌ Erro ao buscar usuário:", err);
                    return res.status(500).json({ error: "Erro ao buscar usuário" });
                }
    
                if (results.length === 0) {
                    console.log("⚠️ Usuário não encontrado!");
                    return res.status(404).json({ error: "Usuário não encontrado" });
                }
    
                console.log("✅ Usuário logado encontrado:", results[0]);
                res.json({ usuario: results[0] });
            });
    
        } catch (error) {
            console.error("❌ Erro ao buscar usuário logado:", error);
            res.status(500).json({ error: "Erro ao recuperar dados do usuário" });
        }
    }
    
    

}    

module.exports = new UsuarioController();

