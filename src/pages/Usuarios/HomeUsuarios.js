import React from "react";
import "../../assets/css/usuarios.css"; // Estilo do componente

function Usuarios() {
    const handleListar = () => {
        console.log("Listar usuários");
        // Lógica para listar usuários
    };

    const handleCadastrar = () => {
        console.log("Cadastrar usuário");
        // Lógica para cadastrar um novo usuário
    };

    const handleAlterar = () => {
        console.log("Alterar usuário");
        // Lógica para alterar um usuário
    };

    const handleExcluir = () => {
        console.log("Excluir usuário");
        // Lógica para excluir um usuário
    };

    return (
        <div className="usuarios-container">
            <h1 className="title">Gerenciamento de Usuários</h1>
            <div className="cards">
                <div className="card" onClick={handleListar}>
                    <i className="icon">📄</i>
                    <h2>Listar</h2>
                    <p>Visualize todos os usuários cadastrados no sistema.</p>
                </div>
                <div className="card" onClick={handleCadastrar}>
                    <i className="icon">➕</i>
                    <h2>Cadastrar</h2>
                    <p>Adicione um novo usuário ao sistema.</p>
                </div>
                <div className="card" onClick={handleAlterar}>
                    <i className="icon">✏️</i>
                    <h2>Alterar</h2>
                    <p>Atualize as informações de um usuário.</p>
                </div>
                <div className="card" onClick={handleExcluir}>
                    <i className="icon">❌</i>
                    <h2>Excluir</h2>
                    <p>Remova um usuário do sistema.</p>
                </div>
            </div>
        </div>
    );
}

export default Usuarios;
