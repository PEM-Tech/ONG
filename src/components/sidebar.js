import React, { useState, useContext, useEffect } from "react";
import "../assets/css/sidebar.css";
import logo from "../assets/logo.jpeg";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [tokenExpiraEm, setTokenExpiraEm] = useState(null);
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        const verificarExpiracaoToken = () => {
            const token = localStorage.getItem("authToken");
            if (token) {
                try {
                    const tokenPayload = JSON.parse(atob(token.split(".")[1]));
                    const expirationTime = tokenPayload.exp * 1000; // Convertendo para milissegundos
                    const timeLeft = expirationTime - Date.now();

                    if (timeLeft <= 0) {
                        logout(); // Se o tempo acabou, faz logout automático
                        return;
                    }

                    const horas = Math.floor(timeLeft / (1000 * 60 * 60)); // Horas restantes
                    const minutos = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)); // Minutos restantes
                    setTokenExpiraEm(`${horas} horas e ${minutos} minutos`);
                } catch (error) {
                    setTokenExpiraEm("Desconhecido");
                }
            }
        };

        verificarExpiracaoToken(); // Verifica imediatamente ao carregar o componente
        const interval = setInterval(verificarExpiracaoToken, 60000); // Atualiza a cada 60s

        return () => clearInterval(interval);
    }, [logout]);

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <button className="collapse-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
                    {isCollapsed ? ">" : "<"}
                </button>
            </div>
            <div className="sidebar-content">
                <div className="profile">
                    <img src={logo} alt="Logo" className={`profile-img ${isCollapsed ? "collapsed-img" : ""}`} />
                </div>
                <ul className="menu">
                    <li onClick={() => navigate("/home")}>🏠 {!isCollapsed && "Home"}</li>
                    <li onClick={() => navigate("/homeassistidos")}>👥 {!isCollapsed && "Assistidos"}</li>
                    <li onClick={() => navigate("/home-voluntarios")}>🙋‍♂️ {!isCollapsed && "Voluntários"}</li>
                    <li onClick={() => navigate("/home-config")}>⚙️ {!isCollapsed && "Configurações"}</li>
                    <li onClick={logout}>⬅️ {!isCollapsed && "Sair"}</li>
                </ul>
            </div>
            <div className="sidebar-footer">
                {!isCollapsed && (
                    <p className="token-expiration-text">
                        Tempo Restante: {tokenExpiraEm !== "Desconhecido" ? `${tokenExpiraEm}` : "Desconhecido"}
                    </p>
                )}
            </div>
        </div>
    );
}

export default Sidebar;
