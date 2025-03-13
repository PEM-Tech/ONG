import axios from "axios";

const API_URL = "http://localhost:5000/api/tipos-consulta";

const tipoConsultaService = {
    getAllTiposConsulta: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar tipos de consulta:", error);
            throw error;
        }
    },

    getTipoConsultaById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar tipo de consulta:", error);
            throw error;
        }
    },

    criarTipoConsulta: async (tipoConsulta) => {
        try {
            const response = await axios.post(API_URL, tipoConsulta);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar tipo de consulta:", error);
            throw error;
        }
    },

    atualizarTipoConsulta: async (id, tipoConsulta) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, tipoConsulta);
            return response.data;
        } catch (error) {
            console.error("Erro ao atualizar tipo de consulta:", error);
            throw error;
        }
    },

    deletarTipoConsulta: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao deletar tipo de consulta:", error);
            throw error;
        }
    }
};

export default tipoConsultaService;
