import Cookies from "js-cookie";

const AUTH_COOKIE_NAME = "user_auth";

// Salvar credenciais no cookie
export const setAuthCookie = (userData) => {
    const expirationHours = 8;
    const expirationDays = expirationHours / 24; // Converte horas para fração de dias

    Cookies.set(AUTH_COOKIE_NAME, JSON.stringify(userData), { 
        expires: expirationDays, // Usa fração de dias
        secure: true, 
        sameSite: "Strict" 
    });
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
