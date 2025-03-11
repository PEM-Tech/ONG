// service/cepService.js

/**
 * Busca os dados de endereço com base no CEP informado.
 * @param {string} cep - CEP informado pelo usuário.
 * @returns {Promise<Object>} - Dados de endereço (rua, bairro, cidade e estado).
 */
export const fetchAddressByCep = async (cep) => {
    // Remove caracteres não numéricos
    const cleanCep = cep.replace(/\D/g, "");
  
    if (cleanCep.length !== 8) {
      throw new Error("CEP inválido");
    }
  
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();
  
    if (data.erro) {
      throw new Error("CEP não encontrado!");
    }
  
    return {
      endereco: data.logradouro || "",
      bairro: data.bairro || "",
      cidade: data.localidade || "",
      estado: data.uf || "",
    };
  };
  