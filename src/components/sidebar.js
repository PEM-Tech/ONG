import React, { useState, useContext, useEffect } from "react";
import "../assets/css/sidebar.css";
import logo from "../assets/logo.jpeg";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [tokenExpiraEm, setTokenExpiraEm] = useState(null);
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        const verificarExpiracaoToken = () => {
            const token = localStorage.getItem("authToken");
            if (token) {
                try {
                    const tokenPayload = JSON.parse(atob(token.split(".")[1]));
                    const expirationTime = tokenPayload.exp * 1000;
                    const timeLeft = expirationTime - Date.now();

                    if (timeLeft <= 0) {
                        logout();
                        return;
                    }

                    const horas = Math.floor(timeLeft / (1000 * 60 * 60));
                    const minutos = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                    setTokenExpiraEm(`${horas} horas e ${minutos} minutos`);
                } catch (error) {
                    setTokenExpiraEm("Desconhecido");
                }
            }
        };

        verificarExpiracaoToken();
        const interval = setInterval(verificarExpiracaoToken, 60000);

        return () => clearInterval(interval);
    }, [logout]);

    return (
        <>
            {/* Sidebar normal no desktop */}
            <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
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

            {/* Botão flutuante para abrir o menu no mobile */}
            <button 
                className="floating-btn" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                ☰
            </button>

            {/* Menu suspenso no mobile */}
            {isMobileMenuOpen && (
                <ul className="dropdown-menu">
                    <li onClick={() => navigate("/home")}>🏠 Home</li>
                    <li onClick={() => navigate("/homeassistidos")}>👥 Assistidos</li>
                    <li onClick={() => navigate("/home-voluntarios")}>🙋‍♂️ Voluntários</li>
                    <li onClick={() => navigate("/home-config")}>⚙️ Configurações</li>
                    <li onClick={logout}>⬅️ Sair</li>
                </ul>
            )}
        </>
    );
}

export default Sidebar;
