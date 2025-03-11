const API_URL = "http://localhost:5000/api/categorias";

const categoriaService = {
  // Buscar todas as categorias
  async getAllCategorias() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Erro ao buscar categorias");
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Criar uma nova categoria
  async criarCategoria(categoria) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoria),
      });
      if (!response.ok) throw new Error("Erro ao criar categoria");
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Atualizar categoria existente
  async atualizarCategoria(id, categoria) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoria),
      });
      if (!response.ok) throw new Error("Erro ao atualizar categoria");
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Deletar categoria
  async deletarCategoria(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erro ao excluir categoria");
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default categoriaService;
