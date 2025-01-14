import React, { useState } from "react";
import "../assets/css/sidebar.css";
import logo from "../assets/logo.jpeg";
import { useNavigate } from "react-router-dom";

function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Controle do dropdown no mobile
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    }; 

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/login");
    };

    const goToHome = () => {
        navigate("/home");
    };

    const goToPacientes = () => {
        navigate("/home-pacientes");
    };

    const goToVoluntarios = () => {
        navigate("/home-voluntarios");
    };

    const goToConfig = () => {
        navigate("/home-config");
    };

    return (
        <>
            {/* Sidebar normal para telas maiores */}
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

            {/* Botão flutuante para dispositivos móveis */}
            <button className="floating-btn" onClick={toggleDropdown}>
                ☰
            </button>

            {/* Dropdown para dispositivos móveis */}
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
