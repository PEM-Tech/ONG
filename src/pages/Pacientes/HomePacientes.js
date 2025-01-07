import React from "react";
import "../../assets/css/pacientes.css"; // Estilo do componente

function Pacientes() {
    const handleListar = () => {
        console.log("Listar pacientes");
        // Lógica para listar pacientes (exemplo: redirecionar para outra página ou carregar dados)
    };

    const handleCadastrar = () => {
        console.log("Cadastrar paciente");
        // Lógica para cadastrar um paciente
    };

    const handleAlterar = () => {
        console.log("Alterar paciente");
        // Lógica para alterar um paciente
    };

    const handleExcluir = () => {
        console.log("Excluir paciente");
        // Lógica para excluir um paciente
    };

    return (
        <div className="pacientes-container">
            <h1 className="title">Gerenciamento de Pacientes</h1>
            <div className="cards">
                <div className="card" onClick={handleListar}>
                    <i className="icon">📄</i>
                    <h2>Listar</h2>
                    <p>Visualize todos os pacientes cadastrados.</p>
                </div>
                <div className="card" onClick={handleCadastrar}>
                    <i className="icon">➕</i>
                    <h2>Cadastrar</h2>
                    <p>Adicione um novo paciente ao sistema.</p>
                </div>
                <div className="card" onClick={handleAlterar}>
                    <i className="icon">✏️</i>
                    <h2>Alterar</h2>
                    <p>Atualize as informações de um paciente.</p>
                </div>
                <div className="card" onClick={handleExcluir}>
                    <i className="icon">❌</i>
                    <h2>Excluir</h2>
                    <p>Remova pacientes do sistema.</p>
                </div>
            </div>
        </div>
    );
}

export default Pacientes;
