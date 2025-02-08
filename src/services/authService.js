import Cookies from "js-cookie";

const AUTH_COOKIE_NAME = "user_auth";

// Salvar credenciais no cookie
export const setAuthCookie = (userData) => {
    Cookies.set(AUTH_COOKIE_NAME, JSON.stringify(userData), { expires: 1, secure: true, sameSite: "Strict" });
};

// Obter usuário do cookie
export const getUserFromCookie = () => {
    const userData = Cookies.get(AUTH_COOKIE_NAME);
    return userData ? JSON.parse(userData) : null;
};

// Remover cookie ao sair
export const removeAuthCookie = () => {
    Cookies.remove(AUTH_COOKIE_NAME);
};
