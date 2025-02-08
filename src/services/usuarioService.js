import axios from "axios";

const API_URL = "http://localhost:5000/usuarios"; // URL base do backend

const usuarioService = {
    // 🆕 Buscar usuário autenticado pelo token
    getUsuarioByToken: async () => {
        const token = localStorage.getItem("token"); // Obtém o token salvo
        if (!token) {
            console.warn("⚠️ Nenhum token encontrado no localStorage.");
            return null;
        }

        try {
            const response = await axios.get(`${API_URL}/me`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true, // Garante que os cookies sejam enviados corretamente
            });
            return response.data.usuario; // Retorna os dados do usuário autenticado
        } catch (error) {
            console.error("❌ Erro ao buscar usuário autenticado:", error);
            return null;
        }
    },

    // Buscar todos os usuários
    getAllUsuarios: async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${API_URL}/buscar`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error("❌ Erro ao buscar usuários:", error);
            throw error;
        }
    },

    // Buscar um usuário pelo ID
    getUsuarioById: async (id) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${API_URL}/buscar/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error("❌ Erro ao buscar usuário:", error);
            throw error;
        }
    },

    // Criar um novo usuário
    criarUsuario: async (usuarioData) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.post(`${API_URL}/criar`, usuarioData, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error("❌ Erro ao criar usuário:", error);
            throw error;
        }
    },

    // Atualizar um usuário existente
    atualizarUsuario: async (id, usuarioData) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.put(`${API_URL}/atualizar/${id}`, usuarioData, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error("❌ Erro ao atualizar usuário:", error);
            throw error;
        }
    },

    // Excluir um usuário pelo ID
    deletarUsuario: async (id) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.delete(`${API_URL}/deletar/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error("❌ Erro ao excluir usuário:", error);
            throw error;
        }
    },

    // Login do usuário
    login: async (dados) => {
        try {
            console.log("📤 Enviando requisição de login:", dados);
            const response = await axios.post(`${API_URL}/login`, dados, { withCredentials: true });
            console.log("✅ Resposta recebida do backend:", response.data);

            if (response.data.token) {
                localStorage.setItem("token", response.data.token); // Salva o token no localStorage
            }

            return response.data;
        } catch (error) {
            console.error("❌ Erro ao tentar fazer login:", error);
            throw error;
        }
    },

    // Logout do usuário
    logout: async () => {
        try {
            await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
            localStorage.removeItem("token"); // Remove o token do localStorage
        } catch (error) {
            console.error("❌ Erro ao fazer logout:", error);
        }
    },
};

export default usuarioService;
