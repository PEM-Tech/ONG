import React from "react";
import "../../assets/css/voluntarios.css"; // Estilo do componente

function Voluntarios() {
    const handleListar = () => {
        console.log("Listar Voluntarios");
        // Lógica para listar Voluntários (exemplo: redirecionar para outra página ou carregar dados)
    };

    const handleCadastrar = () => {
        console.log("Cadastrar Voluntarios");
        // Lógica para cadastrar um voluntário
    };

    const handleAlterar = () => {
        console.log("Alterar Voluntarios");
        // Lógica para alterar um voluntário
    };

    const handleExcluir = () => {
        console.log("Excluir Voluntarios");
        // Lógica para excluir um voluntário
    };

    const handleMarcarPresenca = () => {
        console.log("Marcar Presença");
        // Lógica para marcar presença de voluntários
    };

    return (
        <div className="pacientes-container">
            <h1 className="title">Gerenciamento de Voluntários</h1>
            <div className="cards">
                <div className="card" onClick={handleListar}>
                    <i className="icon">📄</i>
                    <h2>Listar</h2>
                    <p>Visualize todos os Voluntários cadastrados.</p>
                </div>
                <div className="card" onClick={handleCadastrar}>
                    <i className="icon">➕</i>
                    <h2>Cadastrar</h2>
                    <p>Adicione um novo Voluntário ao sistema.</p>
                </div>
                <div className="card" onClick={handleAlterar}>
                    <i className="icon">✏️</i>
                    <h2>Alterar</h2>
                    <p>Atualize as informações de um Voluntário.</p>
                </div>
                <div className="card" onClick={handleExcluir}>
                    <i className="icon">❌</i>
                    <h2>Excluir</h2>
                    <p>Remova Voluntários do sistema.</p>
                </div>
                <div className="card" onClick={handleMarcarPresenca}>
                    <i className="icon">✅</i>
                    <h2>Marcar Presença</h2>
                    <p>Registre a presença dos Voluntários.</p>
                </div>
            </div>
        </div>
    );
}

export default Voluntarios;
