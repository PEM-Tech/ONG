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

    const handleMarcarConsulta = () => {
        console.log("Marcar consulta");
        // Lógica para marcar uma consulta
    };

    const handleRegistrarPresenca = () => {
        console.log("Registrar presença");
        // Lógica para registrar presença de pacientes
    };

    return (
        <div className="pacientes-container">
            <h1 className="title">Gerenciamento de Asssistidos</h1>
            <div className="cards">
                <div className="card" onClick={handleListar}>
                    <i className="icon">📄</i>
                    <h2>Listar</h2>
                    <p>Visualize todos os assistidos cadastrados.</p>
                </div>
                <div className="card" onClick={handleCadastrar}>
                    <i className="icon">➕</i>
                    <h2>Cadastrar</h2>
                    <p>Adicione um novo assistidos ao sistema.</p>
                </div>
                <div className="card" onClick={handleAlterar}>
                    <i className="icon">✏️</i>
                    <h2>Alterar</h2>
                    <p>Atualize as informações de um assistido.</p>
                </div>
                <div className="card" onClick={handleExcluir}>
                    <i className="icon">❌</i>
                    <h2>Excluir</h2>
                    <p>Remova assistidos do sistema.</p>
                </div>
                <div className="card" onClick={handleMarcarConsulta}>
                    <i className="icon">🗓️</i>
                    <h2>Marcar Consulta</h2>
                    <p>Agende uma consulta para o paciente.</p>
                </div>
                <div className="card" onClick={handleRegistrarPresenca}>
                    <i className="icon">✅</i>
                    <h2>Registrar Presença</h2>
                    <p>Registre a presença do Assistido.</p>
                </div>
            </div>
        </div>
    );
}

export default Pacientes;
