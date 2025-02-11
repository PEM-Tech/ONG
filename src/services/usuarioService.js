// usuarioService.js
import api from "../interceptador/api"; // ajuste o caminho conforme a estrutura do projeto

const usuarioService = {
  // Buscar usuário autenticado pelo token
  getUsuarioByToken: async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.warn("⚠ Tentativa de buscar usuário sem token.");
      return null;
    }
  
    try {
      console.log("📡 Enviando token para validação no backend:", token);
      const response = await api.get("/me"); // O interceptor já adiciona o token
  
      // Verifica se a resposta contém a propriedade "usuario"
      if (response.data && response.data.usuario) {
        console.log("✅ Usuário validado:", response.data.usuario);
        return response.data.usuario;
      } else {
        console.warn("⚠ Resposta inesperada da API:", response.data);
        return null;
      }
    } catch (error) {
      console.error("❌ Erro ao obter usuário:", error.response ? error.response.data : error.message);
      return null;
    }
  },
  
  // Buscar todos os usuários
  getAllUsuarios: async () => {
    try {
      const response = await api.get("/buscar", { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao buscar usuários:", error);
      throw error;
    }
  },

  // Buscar um usuário pelo ID
  getUsuarioById: async (id) => {
    try {
      const response = await api.get(`/buscar/${id}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao buscar usuário:", error);
      throw error;
    }
  },

  // Criar um novo usuário
  criarUsuario: async (usuarioData) => {
    try {
      const response = await api.post("/criar", usuarioData, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao criar usuário:", error);
      throw error;
    }
  },

  // Atualizar um usuário existente
  atualizarUsuario: async (id, usuarioData) => {
    try {
      const response = await api.put(`/atualizar/${id}`, usuarioData, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao atualizar usuário:", error);
      throw error;
    }
  },

  // Excluir um usuário pelo ID
  deletarUsuario: async (id) => {
    try {
      const response = await api.delete(`/deletar/${id}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao excluir usuário:", error);
      throw error;
    }
  },

  // Login do usuário
  login: async (dados) => {
    const response = await api.post("/login", dados);
    // Aqui, no login, o AuthContext (ou outro local) deve salvar o token retornado em localStorage como "authToken"
    return response.data;
  },

  // Logout do usuário
  logout: async () => {
    try {
      await api.post("/logout", {}, { withCredentials: true });
      // Remove o token e os dados do usuário utilizando a chave correta
      localStorage.removeItem("authToken");
      localStorage.removeItem("usuario");
    } catch (error) {
      console.error("❌ Erro ao fazer logout:", error);
    }
  },
};

export default usuarioService;
