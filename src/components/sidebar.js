import React, { useState } from "react";
import "../assets/css/sidebar.css";

function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

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
                        src="https://via.placeholder.com/50"
                        alt="Administrador"
                        className="profile-img"
                    />
                    {!isCollapsed && <p>Administrador</p>}
                </div>
                <ul className="menu">
                    <li>
                        <i className="icon">🏠</i>
                        {!isCollapsed && <span>Home</span>}
                    </li>
                    <li>
                        <i className="icon">👥</i>
                        {!isCollapsed && <span>Pacientes</span>}
                    </li>
                    <li>
                        <i className="icon">🙋‍♂️</i>
                        {!isCollapsed && <span>Voluntários</span>}
                    </li>
                    <li>
                        <i className="icon">⚙️</i>
                        {!isCollapsed && <span>Configurações</span>}
                    </li>
                    <li>
                        <i className="icon">⬅️</i>
                        {!isCollapsed && <span>Sair</span>}
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
