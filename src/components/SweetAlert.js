import Swal from "sweetalert2";

/**
 * Exibe um alerta de sucesso.
 * @param {string} titulo - Título da mensagem
 * @param {string} mensagem - Texto da mensagem
 */
export const mostrarSucesso = (titulo, mensagem) => {
    Swal.fire({
        title: titulo,
        text: mensagem,
        icon: "success",
        confirmButtonText: "OK",
    });
};

/**
 * Exibe um alerta de erro.
 * @param {string} titulo - Título da mensagem
 * @param {string} mensagem - Texto da mensagem
 */
export const mostrarErro = (titulo, mensagem) => {
    Swal.fire({
        title: titulo,
        text: mensagem,
        icon: "error",
        confirmButtonText: "OK",
    });
};

/**
 * Exibe um alerta de confirmação antes de realizar uma ação.
 * @param {string} titulo - Título da mensagem
 * @param {string} mensagem - Texto da mensagem
 * @returns {Promise<boolean>} - Retorna `true` se o usuário confirmar, `false` se cancelar
 */
export const confirmarAcao = async (titulo, mensagem) => {
    const resultado = await Swal.fire({
        title: titulo,
        text: mensagem,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, continuar!",
        cancelButtonText: "Cancelar",
    });

    return resultado.isConfirmed;
};
