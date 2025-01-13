import React, { useState } from "react";
import "../assets/css/sidebar.css";
import logo from '../assets/logo.png';
import { useNavigate } from "react-router-dom";

function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate(); // Hook para redirecionamento

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleLogout = () => {
        // Aqui você pode limpar o estado de autenticação, como tokens no localStorage ou context
        localStorage.removeItem("authToken"); // Exemplo de remoção de token
        navigate("/login"); // Redireciona para a tela de login
    };

    const goToHome  = () => {
        navigate("/home");
    };

    const goToPacientes = () => {
        navigate("/home-pacientes"); 
    };

    const goToVoluntarios = () => {
        navigate("/home-voluntarios"); 
    };

    const goToConfig = () => {
        navigate("/home-config")
    }

    return (
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
                    {!isCollapsed && <p>Administrador</p>}
                </div>
                <ul className="menu">
                    <li onClick={goToHome}>
                        <i className="icon">🏠</i>
                        {!isCollapsed && <span>Home</span>}
                    </li>
                    <li onClick={goToPacientes} style={{ cursor: "pointer" }}>
                        <i className="icon">👥</i>
                        {!isCollapsed && <span>Assistidos</span>}
                    </li>
                    <li onClick={goToVoluntarios}>
                        <i className="icon">🙋‍♂️</i>
                        {!isCollapsed && <span>Voluntários</span>}
                    </li>
                    <li onClick={goToConfig}>
                        <i className="icon">⚙️</i>
                        {!isCollapsed && <span>Configurações</span>}
                    </li>   
                    <li onClick={handleLogout} style={{ cursor: "pointer" }}>
                        <i className="icon">⬅️</i>
                        {!isCollapsed && <span>Sair</span>}
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
