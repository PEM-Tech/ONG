import React, { useState, useEffect } from "react";
import tipoConsultaService from "../../services/TipoConsultaService"; // Service para comunicação com o backend
import ModalCadastroTipoConsulta from "./CadastroTipoConsultas.js"; // Import do modal
import "../../assets/css/modalUsuario.css"; // Estilo da tabela
import { confirmarAcao, mostrarSucesso, mostrarErro } from "../../components/SweetAlert";

function TabelaTiposConsulta() {
    const [tiposConsulta, setTiposConsulta] = useState([]);
    const [search, setSearch] = useState("");
    const [ordenar, setOrdenar] = useState("nome"); // Campo de ordenação
    const [exibir, setExibir] = useState(10); // Número de linhas exibidas por vez
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado do modal
    const [tipoConsultaSelecionado, setTipoConsultaSelecionado] = useState(null); // Armazena o tipo de consulta para edição

    useEffect(() => {
        carregarTiposConsulta();
    }, []);

    const carregarTiposConsulta = async () => {
        try {
            const data = await tipoConsultaService.getAllTiposConsulta();
            setTiposConsulta(data);
        } catch (error) {
            mostrarErro("Erro ao buscar tipos de consulta", "Não foi possível carregar a lista de tipos de consulta.");
        }
    };

    // Função chamada ao adicionar ou editar um tipo de consulta
    const handleAddTipoConsulta = async (tipoConsulta) => {
        const confirmacao = await confirmarAcao(
            tipoConsultaSelecionado ? "Confirmar atualização?" : "Confirmar cadastro?",
            tipoConsultaSelecionado ? "Deseja realmente atualizar os dados deste tipo de consulta?" : "Deseja realmente cadastrar este tipo de consulta?"
        );
    
        if (!confirmacao) return;
    
        try {
            if (tipoConsultaSelecionado) {
                await tipoConsultaService.atualizarTipoConsulta(tipoConsultaSelecionado.id, tipoConsulta);
                mostrarSucesso("Tipo de Consulta atualizado!", "Os dados foram atualizados com sucesso.");
            } else {
                await tipoConsultaService.criarTipoConsulta(tipoConsulta);
                mostrarSucesso("Tipo de Consulta cadastrado!", "O tipo de consulta foi adicionado com sucesso.");
            }
    
            setIsModalOpen(false);
            setTipoConsultaSelecionado(null);
            carregarTiposConsulta();
        } catch (error) {
            mostrarErro("Erro ao salvar", "Houve um problema ao salvar o tipo de consulta.");
        }
    };
    
    const handleExcluir = async (id) => {
        const confirmado = await confirmarAcao("Tem certeza?", "Essa ação não pode ser desfeita!");
    
        if (confirmado) {
            try {
                await tipoConsultaService.deletarTipoConsulta(id);
                setTiposConsulta((prev) => prev.filter((tipo) => tipo.id !== id)); // Atualiza a lista após excluir
                mostrarSucesso("Tipo de Consulta Excluído", "O tipo de consulta foi removido com sucesso!");
            } catch (error) {
                console.error("Erro ao excluir tipo de consulta:", error);
                mostrarErro("Erro ao Excluir", "Ocorreu um erro ao excluir o tipo de consulta.");
            }
        }
    };
    const handleEditar = (tipoConsulta) => {
        setTipoConsultaSelecionado(tipoConsulta);
        setIsModalOpen(true);
    };
    
    return (
        <div className="tabela-container">
            <h1>Gerenciamento de Tipos de Consulta</h1>
            <div className="filtros">
                <input
                    type="text"
                    placeholder="Pesquisar por nome"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    value={ordenar}
                    onChange={(e) => setOrdenar(e.target.value)}
                >
                    <option value="nome">Ordenar por Nome</option>
                </select>
                <select
                    value={exibir}
                    onChange={(e) => setExibir(Number(e.target.value))}
                >
                    <option value={5}>Exibir 5</option>
                    <option value={10}>Exibir 10</option>
                    <option value={20}>Exibir 20</option>
                </select>
                <button
                    className="botao-adicionar"
                    onClick={() => {
                        setTipoConsultaSelecionado(null); // Garante que é um novo cadastro
                        setIsModalOpen(true);
                    }} 
                >
                    Adicionar Tipo de Consulta
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {tiposConsulta.map((tipoConsulta) => (
                        <tr key={tipoConsulta.id}>
                            <td>{tipoConsulta.nome}</td>
                            <td>
                                <button onClick={() => handleEditar(tipoConsulta)}>✏️</button>
                                <button onClick={() => handleExcluir(tipoConsulta.id)}>❌</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal de Cadastro/Edição */}
            <ModalCadastroTipoConsulta
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setTipoConsultaSelecionado(null);
                }} 
                tipoConsultaEditada={tipoConsultaSelecionado} // Passa os dados para edição
                onSubmit={handleAddTipoConsulta} // Salva novo tipo de consulta ou atualiza
            />
        </div>
    );
}

export default TabelaTiposConsulta;
