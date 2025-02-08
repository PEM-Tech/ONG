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
      console.log("token recuperdo:", storedToken);
       // Obtém o token salvo
      if (storedToken) {
        try {
          setToken(storedToken);
          const usuarioAutenticado = await usuarioService.getUsuarioByToken();
          if (usuarioAutenticado) {
            console.log("🔄 Sessão restaurada:", usuarioAutenticado);
            setUser(usuarioAutenticado);
            // Remova ou comente a linha abaixo:
            // navigate("/home"); 
          } else {
            console.warn("⚠ Nenhum usuário autenticado encontrado.");
            logout(); // Se o token for inválido, desloga
          }
        } catch (error) {
          console.error("❌ Erro ao restaurar sessão:", error);
          logout(); // Se der erro na verificação, desloga
        }
      }
    };

    restaurarSessao();
  }, []); // Executa apenas uma vez ao montar o componente

  const login = async (dados) => {
    try {
        console.log("📤 Tentando fazer login com:", dados);
        const response = await usuarioService.login(dados);

        if (response.token) {
            console.log("🔑 Token recebido:", response.token);
            localStorage.setItem("authToken", response.token);
            localStorage.setItem("usuario", JSON.stringify(response.usuario));
            setUser(response.usuario);
            setToken(response.token);
            console.log("✅ Login bem-sucedido. Redirecionando...");
            navigate("/home");
        } else {
            console.warn("⚠ Nenhum token recebido do servidor.");
        }
    } catch (error) {
        console.error("❌ Erro ao fazer login:", error);
    }
};


  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("usuario");
    setUser(null);
    setToken(null);
    navigate("/login"); // Redireciona para login após logout
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
