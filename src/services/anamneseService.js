

/**
 * Remove todos os caracteres que não são dígitos de uma string.
 * @param {string} value - Valor com máscara.
 * @returns {string} Valor sem máscara.
 */
function removeMask(value) {
    return value.replace(/\D/g, "");
  }
  
  /**
   * Envia os dados da anamnese para cadastrar um novo assistido.
   *
   * @param {Object} data - Objeto contendo os dados do formulário.
   * @param {string} token - Token de autorização para a API.
   * @param {number|string} userId - ID do usuário que está realizando o cadastro.
   * @returns {Promise<Object>} Resposta da API com os dados do assistido cadastrado.
   * @throws {Error} Caso a requisição não seja bem-sucedida.
   */
  export async function createAssistido(data, token, userId) {
    // Cria um objeto FormData para suportar envio de arquivos e demais campos
    const submissionData = new FormData();
  
    // Adiciona todos os campos do formulário ao FormData
    Object.keys(data).forEach((key) => {
      submissionData.append(key, data[key]);
    });
  
    // Remove máscaras de campos específicos, se presentes
    if (data.cpf) {
      submissionData.set("cpf", removeMask(data.cpf));
    }
    if (data.celular) {
      submissionData.set("celular", removeMask(data.celular));
    }
    if (data.cep) {
      submissionData.set("cep", removeMask(data.cep));
    }
  
    // Adiciona o campo que identifica quem executou o cadastro
    submissionData.append("executado_por", userId);
  
    // Realiza a chamada para o backend
    const response = await fetch("http://localhost:5000/api/assistidos", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: submissionData,
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao cadastrar assistido.");
    }
  
    return await response.json();
  }
  