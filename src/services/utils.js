// service/utils.js

/**
 * Remove qualquer caractere que não seja número de uma string.
 * @param {string} value - String a ser "desmascarada".
 * @returns {string} - String contendo somente números.
 */
export const removeMask = (value) => {
    return value.replace(/\D/g, "");
  };
  