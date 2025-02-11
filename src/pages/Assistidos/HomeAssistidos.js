import React from "react";
import { useNavigate } from "react-router-dom"; // Importa o hook para navegação
import "../../assets/css/pacientes.css"; // Estilo do componente

function Pacientes() {
    const navigate = useNavigate(); // Inicializa a navegação

    const handleListar = () => {
        console.log("Listar assistidos");
        navigate("/listarassistido");
    };

    const handleCadastrar = () => {
        console.log("Cadastrar assistido");
        navigate("/cadastrar-assistido"); // 🔹 Redireciona para a página de cadastro
    };

    const handleAlterar = () => {
        console.log("Alterar assistido");
        // Lógica para alterar assistidos
    };

    const handleExcluir = () => {
        console.log("Excluir assistido");
        // Lógica para excluir assistidos
    };

    const handleMarcarConsulta = () => {
        console.log("Marcar consulta");
        // Lógica para marcar consulta
    };

    const handleRegistrarPresenca = () => {
        console.log("Registrar presença");
        // Lógica para registrar presença
    };

    return (
        <div className="pacientes-container">
            <h1 className="title">Gerenciamento de Assistidos</h1>
            <div className="cards">
                <div className="card" onClick={handleListar}>
                    <i className="icon">📄</i>
                    <h2>Listar</h2>
                    <p>Visualize todos os assistidos cadastrados.</p>
                </div>
                <div className="card" onClick={handleCadastrar}>
                    <i className="icon">➕</i>
                    <h2>Cadastrar</h2>
                    <p>Adicione um novo assistido ao sistema.</p>
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
                    <p>Agende uma consulta para o assistido.</p>
                </div>
                <div className="card c1" onClick={handleRegistrarPresenca}>
                    <i className="icon">✅</i>
                    <h2>Registrar Presença</h2>
                    <p>Registre a presença do assistido.</p>
                </div>
            </div>
        </div>
    );
}

export default Pacientes;
