import React from "react";
import "../../assets/css/voluntarios.css"; // Estilo do componente
import { useNavigate } from "react-router-dom";




function Voluntarios() {
    const Navigate = useNavigate(); // Isso dá erro se estiver fora de um componente

    const handleListar = () => {
        console.log("Listar Voluntarios");
        Navigate("/listarVoluntarios")
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
                    <h2>Gerenciar</h2>
                    <p>Gerencie os Voluntários cadastrados, podendo adicionar, editar e excluir registros.</p>
                </div>
                <div className="card c1" onClick={handleMarcarPresenca}>
                    <i className="icon">✅</i>
                    <h2>Marcar Presença</h2>
                    <p>Registre a presença dos Voluntários.</p>
                </div>
            </div>
        </div>
    );
}

export default Voluntarios;
