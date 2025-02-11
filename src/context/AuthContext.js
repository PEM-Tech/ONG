import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usuarioService from "../services/usuarioService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const restaurarSessao = async () => {
      const storedToken = localStorage.getItem("authToken");
      console.log("📡 Enviando token para validação:", storedToken);
      const storedUser = JSON.parse(localStorage.getItem("usuario"));
  
      console.log("🔄 Tentando restaurar sessão...");
      console.log("🔑 Token armazenado:", storedToken);
      console.log("👤 Usuário armazenado:", storedUser);
  
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        console.log("✅ Sessão restaurada localmente.");
      } else if (storedToken) {
        try {
          console.log("📡 Chamando `getUsuarioByToken()` para buscar usuário...");
          const usuarioAutenticado = await usuarioService.getUsuarioByToken();
  
          console.log("✅ Resposta do servidor:", usuarioAutenticado);
  
          if (usuarioAutenticado) {
            setUser(usuarioAutenticado);
            localStorage.setItem("usuario", JSON.stringify(usuarioAutenticado));
          } else {
            console.warn("⚠ Nenhum usuário autenticado encontrado. Redirecionando para login.");
            logout();
          }
        } catch (error) {
          console.error("❌ Erro ao restaurar sessão:", error);
          logout();
        }
      } else {
        console.warn("⚠ Nenhum token encontrado. Redirecionando para login.");
        logout();
      }
    };
  
    restaurarSessao();
  }, []);
  

  const login = async (dados) => {
    try {
      console.log("📤 Tentando fazer login com:", dados);
      const response = await usuarioService.login(dados);
      
      if (response.token) {
        localStorage.setItem("authToken", response.token); // Salva o token no localStorage
        localStorage.setItem("usuario", JSON.stringify(response.usuario)); // Salva os dados do usuário
        setUser(response.usuario);
        setToken(response.token);
        navigate("/home"); // Redireciona após login bem-sucedido
      }
    } catch (error) {
        console.error("❌ Erro ao fazer login:", error);
    }
};


  const logout = () => {
    console.log("🔴 Função logout() chamada!");
    localStorage.removeItem("authToken");
    localStorage.removeItem("usuario");
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
