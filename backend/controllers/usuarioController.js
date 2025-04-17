const Usuario = require("../models/usuarioModel");
const connection = require("../config/database");
const Audit = require("../models/auditModel");
const jwt = require("jsonwebtoken");

// Buscar todos os usuários
const getAllUsuarios = async (req, res) => {
    try {
        const usuarioLogado = req.user?.nome || req.user?.email || "Desconhecido";
        console.log("🔍 Buscando todos os usuários...");
        const usuarios = await Usuario.getAll();
        
        await Audit.log(usuarioLogado, "READ", "Listagem de todos os usuários");
        res.status(200).json(usuarios);
    } catch (error) {
        console.error("❌ Erro ao buscar usuários:", error);
        res.status(500).json({ error: error.message });
    }
};

// Buscar usuário pelo ID
const getUsuarioById = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioLogado = req.user?.nome || req.user?.email || "Desconhecido";
        
        console.log(`🔍 Buscando usuário com ID: ${id}`);
        const usuario = await Usuario.getById(id);

        if (!usuario) {
            console.log("⚠ Usuário não encontrado.");
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        await Audit.log(usuarioLogado, "READ", `Consulta do usuário ID ${id}`);
        res.status(200).json(usuario);
    } catch (error) {
        console.error("❌ Erro ao buscar usuário:", error);
        res.status(500).json({ error: error.message });
    }
};

// Criar usuário
const createUsuario = async (req, res) => {
    try {
        const { nome, email, senha, desabilitado, permissao } = req.body;
        const usuarioLogado = req.user?.nome || req.user?.email || "Desconhecido";

        if (!nome || !email || !senha) {
            return res.status(400).json({ error: "Nome, email e senha são obrigatórios." });
        }

        const novoUsuario = await Usuario.create(req.body);

        await Audit.log(usuarioLogado, "CREATE", `Usuário criado: ${nome}`);
        res.status(201).json({
            message: "Usuário cadastrado com sucesso!",
            usuario: novoUsuario,
        });

    } catch (error) {
        console.error("❌ Erro ao criar usuário:", error);
        res.status(500).json({ error: "Erro interno ao cadastrar usuário." });
    }
};

// Atualizar usuário
const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const dadosAtualizados = req.body;
        const usuarioLogado = req.user?.nome || req.user?.email || "Desconhecido";

        if (!dadosAtualizados.nome || !dadosAtualizados.email) {
            return res.status(400).json({ error: "Nome e email são obrigatórios." });
        }

        if (!dadosAtualizados.senha || dadosAtualizados.senha.trim() === "") {
            delete dadosAtualizados.senha;
        }

        const usuarioAtualizado = await Usuario.update(id, dadosAtualizados);
        await Audit.log(usuarioLogado, "UPDATE", `Usuário atualizado: ${dadosAtualizados.nome}`);

        res.status(200).json({ message: "Usuário atualizado com sucesso!", usuario: usuarioAtualizado });

    } catch (error) {
        console.error("❌ Erro ao atualizar usuário:", error);
        res.status(500).json({ error: error.message });
    }
};

// Excluir usuário
const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioLogado = req.user?.nome || req.user?.email || "Desconhecido";

        await Usuario.delete(id);
        await Audit.log(usuarioLogado, "DELETE", `Usuário ID ${id} excluído`);

        res.status(200).json({ message: "Usuário deletado com sucesso!" });

    } catch (error) {
        console.error("❌ Erro ao deletar usuário:", error);
        res.status(500).json({ error: error.message });
    }
};

// Login de usuário
const loginUsuario = async (req, res) => {
    console.log("📥 Requisição recebida no backend:", req.body);
    const { email, senha } = req.body;

    try {
        const query = "SELECT * FROM usuarios WHERE email = ?";
        const [results] = await connection.query(query, [email]);

        if (results.length === 0) {
            console.log("⚠️ Usuário não encontrado:", email);
            await Audit.log("Sistema", "LOGIN_FAILED", `Tentativa de login falhou para ${email}`);
            return res.status(401).json({ error: "Usuário não encontrado" });
        }

        const usuario = results[0];

        if (usuario.senha !== senha) {
            console.log("⚠️ Senha incorreta para usuário:", usuario.email);
            await Audit.log("Sistema", "LOGIN_FAILED", `Tentativa de login falhou para ${usuario.email}`);
            return res.status(401).json({ error: "Senha incorreta" });
        }

        const token = jwt.sign(
            { id: usuario.id, nome: usuario.nome, email: usuario.email, permissao: usuario.permissao },
            "secreta",
            { expiresIn: "8h" }
        );

        await connection.query("UPDATE usuarios SET token = ? WHERE id = ?", [token, usuario.id]);
        await Audit.log(usuario.nome, "LOGIN_SUCCESS", `Usuário ${usuario.nome} fez login`);

        console.log("✅ Login bem-sucedido:", usuario.email);
        res.json({ message: "Login bem-sucedido!", usuario, token });

    } catch (error) {
        console.error("❌ Erro ao processar login:", error);
        res.status(500).json({ error: "Erro ao processar login" });
    }
};


// Exporta todas as funções como um objeto
module.exports = {
    getAllUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    loginUsuario
};
