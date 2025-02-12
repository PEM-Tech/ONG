import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import usuarioService from "../services/usuarioService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    console.log("🔴 Logout chamado!");
    localStorage.removeItem("authToken");
    localStorage.removeItem("usuario");
    setUser(null);
    setToken(null);
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const restaurarSessao = async () => {
      setLoading(true);
      const storedToken = localStorage.getItem("authToken");
      const storedUser = JSON.parse(localStorage.getItem("usuario"));

      if (!storedToken) {
        setLoading(false);
        return;
      }

      if (storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        setLoading(false);
        return;
      }

      try {
        const usuarioAutenticado = await usuarioService.getUsuarioByToken(storedToken);
        if (usuarioAutenticado) {
          setUser(usuarioAutenticado);
          localStorage.setItem("usuario", JSON.stringify(usuarioAutenticado));
        } else {
          logout();
        }
      } catch (error) {
        console.error("❌ Erro ao restaurar sessão:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    restaurarSessao();
  }, [logout]);

  const login = async (dados) => {
    try {
      const response = await usuarioService.login(dados);
      if (response?.token) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("usuario", JSON.stringify(response.usuario));
        setUser(response.usuario);
        setToken(response.token);
        return response.usuario;
      }
    } catch (error) {
      console.error("❌ Erro ao fazer login:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
