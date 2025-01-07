import React from "react";
import "../../assets/css/HomeConfig.css"; // Estilo do componente

function HomeConfiguracoes() {
    const handleGerenciarCategorias = () => {
        console.log("Gerenciar Categorias dos Voluntários");
        // Lógica para gerenciar categorias
    };

    const handleManipularUsuarios = () => {
        console.log("Manipular Usuários");
        // Lógica para manipular usuários
    };

    return (
        <div className="configuracoes-container">
            <h1 className="title">Configurações</h1>
            <div className="cards">
                <div className="card" onClick={handleGerenciarCategorias}>
                    <i className="icon">🏷️</i>
                    <h2>Categorias</h2>
                    <p>Gerencie as categorias dos voluntários.</p>
                </div>
                <div className="card" onClick={handleManipularUsuarios}>
                    <i className="icon">👤</i>
                    <h2>Usuários</h2>
                    <p>Adicione, edite ou exclua usuários do sistema.</p>
                </div>
            </div>
        </div>
    );
}

export default HomeConfiguracoes;
