import React, { useState, useEffect } from "react";
import categoriaService from "../../services/CategoriaService"; // Service para comunicação com o backend
import ModalCadastroCategoria from "./CadastroCategorias.js"; // Import do modal
import "../../assets/css/modalUsuario.css"; // Estilo da tabela
import { confirmarAcao, mostrarSucesso, mostrarErro } from "../../components/SweetAlert";
import { useNavigate } from "react-router-dom";

function TabelaCategorias() {
    const navigate = useNavigate();
    const [categorias, setCategorias] = useState([]);
    const [search, setSearch] = useState("");
    const [ordenar, setOrdenar] = useState("nome"); // Campo de ordenação
    const [recordsPerPage, setRecordsPerPage] = useState(10); // Número de categorias por página
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado do modal
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null); // Armazena a categoria para edição

    useEffect(() => {
        carregarCategorias();
    }, []);

    const carregarCategorias = async () => {
        try {
            const data = await categoriaService.getAllCategorias();
            setCategorias(data);
        } catch (error) {
            mostrarErro("Erro ao buscar categorias", "Não foi possível carregar a lista de categorias.");
        }
    };

    // Função chamada ao adicionar ou editar uma categoria
    const handleAddCategoria = async (categoria) => {
        const confirmacao = await confirmarAcao(
            categoriaSelecionada ? "Confirmar atualização?" : "Confirmar cadastro?",
            categoriaSelecionada ? "Deseja realmente atualizar os dados desta categoria?" : "Deseja realmente cadastrar esta categoria?"
        );

        if (!confirmacao) return;

        try {
            if (categoriaSelecionada) {
                await categoriaService.atualizarCategoria(categoriaSelecionada.id, categoria);
                mostrarSucesso("Categoria atualizada!", "Os dados foram atualizados com sucesso.");
            } else {
                await categoriaService.criarCategoria(categoria);
                mostrarSucesso("Categoria cadastrada!", "A categoria foi adicionada com sucesso.");
            }

            setIsModalOpen(false);
            setCategoriaSelecionada(null);
            carregarCategorias();
        } catch (error) {
            mostrarErro("Erro ao salvar", "Houve um problema ao salvar a categoria.");
        }
    };

    const handleExcluir = async (id) => {
        const confirmado = await confirmarAcao("Tem certeza?", "Essa ação não pode ser desfeita!");

        if (confirmado) {
            try {
                await categoriaService.deletarCategoria(id);
                setCategorias((prev) => prev.filter((cat) => cat.id !== id)); // Atualiza a lista após excluir
                mostrarSucesso("Categoria Excluída", "A categoria foi removida com sucesso!");
            } catch (error) {
                mostrarErro("Erro ao Excluir", "Ocorreu um erro ao excluir a categoria.");
            }
        }
    };

    const handleEditar = (categoria) => {
        setCategoriaSelecionada(categoria);
        setIsModalOpen(true);
    };

    // 🔹 Filtrando e ordenando categorias
    const categoriasFiltradas = categorias
        .filter((categoria) => categoria.nome.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => (a[ordenar] > b[ordenar] ? 1 : -1));

    // 🔹 Paginação: cálculo dos registros na página atual
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = categoriasFiltradas.slice(indexOfFirstRecord, indexOfLastRecord);

    // 🔹 Cálculo do total de páginas
    const totalPages = Math.ceil(categoriasFiltradas.length / recordsPerPage);

    // 🔹 Funções de navegação
    const goToFirstPage = () => setCurrentPage(1);
    const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const goToLastPage = () => setCurrentPage(totalPages);

    return (
        <div className="tabela-container">
            <div className="title-homecategorias">
            <button className="back-button-voluntarios" onClick={() => navigate(-1)}>⬅ Voltar</button>
            <h1>Gerenciamento de Categorias</h1>
            </div>
            <div className="filtros">
                <input type="text" placeholder="Pesquisar por nome" value={search} onChange={(e) => setSearch(e.target.value)} />

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
                        setCategoriaSelecionada(null);
                        setIsModalOpen(true);
                    }}
                >
                    Adicionar Categoria
                </button>
            </div>

            {/* Tabela de categorias */}
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRecords.map((categoria) => (
                        <tr key={categoria.id}>
                            <td>{categoria.nome}</td>
                            <td>
                                <button onClick={() => handleEditar(categoria)}>✏️</button>
                                <button onClick={() => handleExcluir(categoria.id)}>❌</button>
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
            <ModalCadastroCategoria
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setCategoriaSelecionada(null);
                }}
                categoriaEditada={categoriaSelecionada}
                onSubmit={handleAddCategoria}
            />
        </div>
    );
}

export default TabelaCategorias;
