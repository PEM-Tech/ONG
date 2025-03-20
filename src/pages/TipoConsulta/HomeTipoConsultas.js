import React, { useState, useEffect } from "react";
import tipoConsultaService from "../../services/TipoConsultaService"; // Service para comunicação com o backend
import ModalCadastroTipoConsulta from "./CadastroTipoConsultas.js"; // Import do modal
import "../../assets/css/modalUsuario.css"; // Estilo da tabela
import { confirmarAcao, mostrarSucesso, mostrarErro } from "../../components/SweetAlert";
import { useNavigate } from "react-router-dom";

function TabelaTiposConsulta() {
    const navigate = useNavigate();
    const [tiposConsulta, setTiposConsulta] = useState([]);
    const [search, setSearch] = useState("");
    const [ordenar, setOrdenar] = useState("nome"); // Campo de ordenação
    const [recordsPerPage, setRecordsPerPage] = useState(10); // Quantidade de registros por página
    const [currentPage, setCurrentPage] = useState(1);
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
                mostrarErro("Erro ao Excluir", "Ocorreu um erro ao excluir o tipo de consulta.");
            }
        }
    };

    const handleEditar = (tipoConsulta) => {
        setTipoConsultaSelecionado(tipoConsulta);
        setIsModalOpen(true);
    };

    // 🔹 Filtrando e ordenando tipos de consulta
    const tiposFiltrados = tiposConsulta
        .filter((tipo) => tipo.nome.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => (a[ordenar] > b[ordenar] ? 1 : -1));

    // 🔹 Paginação: cálculo dos registros na página atual
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = tiposFiltrados.slice(indexOfFirstRecord, indexOfLastRecord);

    // 🔹 Cálculo do total de páginas
    const totalPages = Math.ceil(tiposFiltrados.length / recordsPerPage);

    // 🔹 Funções de navegação
    const goToFirstPage = () => setCurrentPage(1);
    const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const goToLastPage = () => setCurrentPage(totalPages);

    return (
        <div className="tabela-container">
            <div className="title-tipoconsulta"> 
            <button className="back-button-tipoconsulta" onClick={() => navigate(-1)}>⬅ Voltar</button>
            <h1>Gerenciamento de Tipos de Consulta</h1>
            </div>
            <div className="filtros">
                <input
                    type="text"
                    placeholder="Pesquisar por nome"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select value={ordenar} onChange={(e) => setOrdenar(e.target.value)}>
                    <option value="nome">Ordenar por Nome</option>
                </select>

                <select value={recordsPerPage} onChange={(e) => setRecordsPerPage(Number(e.target.value))}>
                    <option value={5}>Exibir 5</option>
                    <option value={10}>Exibir 10</option>
                    <option value={20}>Exibir 20</option>
                </select>

                <button
                    className="botao-adicionar"
                    onClick={() => {
                        setTipoConsultaSelecionado(null);
                        setIsModalOpen(true);
                    }}
                >
                    Adicionar Tipo de Consulta
                </button>
            </div>

            {/* Tabela de tipos de consulta */}
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRecords.map((tipoConsulta) => (
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

            {/* Controles de Paginação */}
            <div className="pagination">
                <button onClick={goToFirstPage} disabled={currentPage === 1}>
                    ⏮ Primeira
                </button>
                <button onClick={prevPage} disabled={currentPage === 1}>
                    ⬅ Anterior
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button onClick={nextPage} disabled={currentPage === totalPages}>
                    Próxima ➡
                </button>
                <button onClick={goToLastPage} disabled={currentPage === totalPages}>
                    Última ⏭
                </button>
            </div>

            {/* Modal de Cadastro/Edição */}
            <ModalCadastroTipoConsulta
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setTipoConsultaSelecionado(null);
                }}
                tipoConsultaEditada={tipoConsultaSelecionado}
                onSubmit={handleAddTipoConsulta}
            />
        </div>
    );
}

export default TabelaTiposConsulta;
