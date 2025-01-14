import axios from "axios";

// URL base do backend, configure de acordo com o ambiente
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const usuarioService = {
  /**
   * Busca todos os usuários
   * @returns {Promise} Lista de usuários
   */
  getAllUsuarios: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/usuarios/buscar`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar os usuários:", error);
      throw error;
    }
  },

  /**
   * Busca um usuário pelo ID
   * @param {number} id - ID do usuário
   * @returns {Promise} Dados do usuário
   */
  getUsuarioById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/usuarios/buscar/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar o usuário com ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cria um novo usuário
   * @param {Object} usuarioData - Dados do novo usuário
   * @returns {Promise} Usuário criado
   */
  createUsuario: async (usuarioData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/usuarios/criar`, usuarioData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar o usuário:", error);
      throw error;
    }
  },

  /**
   * Atualiza os dados de um usuário pelo ID
   * @param {number} id - ID do usuário
   * @param {Object} usuarioData - Novos dados do usuário
   * @returns {Promise} Usuário atualizado
   */
  updateUsuario: async (id, usuarioData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/usuarios/atualizar/${id}`, usuarioData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar o usuário com ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Remove um usuário pelo ID
   * @param {number} id - ID do usuário
   * @returns {Promise} Confirmação da exclusão
   */
  deleteUsuario: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/usuarios/deletar/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao excluir o usuário com ID ${id}:`, error);
      throw error;
    }
  },
};

export default usuarioService;
