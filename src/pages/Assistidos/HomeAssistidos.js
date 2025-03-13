import React from "react";
import { useNavigate } from "react-router-dom"; // Importa o hook para navegação
import "../../assets/css/pacientes.css"; // Estilo do componente

function Pacientes() {
    const navigate = useNavigate(); // Inicializa a navegação

    const handleListar = () => {
        navigate("/listarassistido");
    };

   
    const handleMarcarConsulta = () => {
        console.log("Marcar consulta");
        navigate("/agenda");
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
                    <h2>Gerenciar</h2>
                    <p>Gerencie os assistidos cadastrados, podendo adicionar, editar e excluir registros.</p>
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
