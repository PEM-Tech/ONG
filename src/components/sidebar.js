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
        const atualizarTempoRestante = () => {
            const token = localStorage.getItem("authToken");
            if (token) {
                try {
                    const tokenPayload = JSON.parse(atob(token.split(".")[1]));
                    const expirationTime = tokenPayload.exp * 1000; // Convertendo para milissegundos
                    const timeLeft = expirationTime - Date.now();
    
                    if (timeLeft > 0) {
                        const horas = Math.floor(timeLeft / (1000 * 60 * 60)); // Horas restantes
                        const minutos = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)); // Minutos restantes
                        setTokenExpiraEm(`${horas} horas e ${minutos} minutos`);
                    } else {
                        setTokenExpiraEm("Expirado");
                    }
                } catch (error) {
                    setTokenExpiraEm("Desconhecido");
                }
            }
        };
    
        atualizarTempoRestante();
    
        const interval = setInterval(atualizarTempoRestante, 60000);
    
        return () => clearInterval(interval);
    }, []);
    

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const handleLogout = () => {
        logout();
    };

    const goToHome = () => {
        navigate("/home");
    };

    const goToPacientes = () => {
        navigate("/homeassistidos");
    };

    const goToVoluntarios = () => {
        navigate("/home-voluntarios");
    };

    const goToEstoque = () => {};

    const goToConfig = () => {
        navigate("/home-config");
    };

    return (
        <>
            <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
                <div className="sidebar-header">
                    <button className="collapse-btn" onClick={toggleSidebar}>
                        {isCollapsed ? ">" : "<"}
                    </button>
                </div>
                <div className="sidebar-content">
                    <div className="profile">
                        <img
                            src={logo}
                            alt=""
                            className={`profile-img ${isCollapsed ? "collapsed-img" : ""}`}
                        />
                    </div>
                    <ul className="menu">
                        <li onClick={goToHome}>
                            <i className="icon">🏠</i>
                            {!isCollapsed && <span>Home</span>}
                        </li>
                        <li onClick={goToPacientes}>
                            <i className="icon">👥</i>
                            {!isCollapsed && <span>Assistidos</span>}
                        </li>
                        <li onClick={goToVoluntarios}>
                            <i className="icon">🙋‍♂️</i>
                            {!isCollapsed && <span>Voluntários</span>}
                        </li>
                        <li onClick={goToEstoque}>
                            <i className="icon">📦</i>
                            {!isCollapsed && <span>Estoque</span>}
                        </li>
                        <li onClick={goToConfig}>
                            <i className="icon">⚙️</i>
                            {!isCollapsed && <span>Configurações</span>}
                        </li>
                        <li onClick={handleLogout}>
                            <i className="icon">⬅️</i>
                            {!isCollapsed && <span>Sair</span>}
                        </li>
                    </ul>
                </div>
                <div className="sidebar-footer">
                    {!isCollapsed && (
                        <p className="token-expiration-text">
                            Tempo Restante: {tokenExpiraEm !== "Desconhecido" ? `${tokenExpiraEm} min` : "Desconhecido"}
                        </p>
                    )}
                </div>
            </div>

            <button className="floating-btn" onClick={toggleDropdown}>
                ☰
            </button>

            {isDropdownVisible && (
                <ul className="dropdown-menu">
                    <li onClick={goToHome}>🏠 Home</li>
                    <li onClick={goToPacientes}>👥 Assistidos</li>
                    <li onClick={goToVoluntarios}>🙋‍♂️ Voluntários</li>
                    <li onClick={goToConfig}>⚙️ Configurações</li>
                    <li onClick={handleLogout}>⬅️ Sair</li>
                </ul>
            )}
        </>
    );
}

export default Sidebar;
