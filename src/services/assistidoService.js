// service/assistidoService.js

/**
 * Cria um novo assistido.
 * @param {Object} data - Dados do assistido.
 * @param {string} token - Token de autenticação.
 * @param {number|string} userId - ID do usuário que está executando a operação.
 * @returns {Promise<Object>} - Dados retornados pela API.
 */
// service/assistidoService.js

export const createAssistido = async (data, token, userId) => {
    const submissionData = new FormData();
    for (const key in data) {
      submissionData.append(key, data[key]);
    }
    submissionData.append("executado_por", userId);
  
    const response = await fetch("http://localhost:5000/api/assistidos", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: submissionData,
    });
  
    const responseData = await response.json();
  
    if (!response.ok) {
      // Supondo que a API retorne um objeto com detalhes dos erros, ex:
      // { errors: { nome: "Nome não preenchido", cpf: "CPF já cadastrado" } }
      const error = new Error("Erro ao salvar cadastro.");
      error.details = responseData.errors; // ou outra propriedade com os erros
      throw error;
    }
  
    return responseData;
  };
  
  
  /**
   * (Opcional) Atualiza os dados de um assistido.
   * @param {number|string} id - ID do assistido a ser atualizado.
   * @param {Object} data - Dados atualizados do assistido.
   * @param {string} token - Token de autenticação.
   * @returns {Promise<Object>}
   */
  export const updateAssistido = async (id, data, token) => {
    const response = await fetch(`http://localhost:5000/api/assistidos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      throw new Error("Erro ao atualizar cadastro.");
    }
  
    return await response.json();
  };
  
  /**
   * (Opcional) Busca um assistido pelo ID.
   * @param {number|string} id - ID do assistido.
   * @param {string} token - Token de autenticação.
   * @returns {Promise<Object>}
   */
  export const getAssistido = async (id, token) => {
    const response = await fetch(`http://localhost:5000/api/assistidos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error("Erro ao buscar assistido.");
    }
  
    return await response.json();
  };
  