import React, { useState, useEffect } from "react";
import categoriaService from "../../services/CategoriaService"; // Service para comunicação com o backend
import ModalCadastroCategoria from "./CadastroCategorias.js"; // Import do modal
import "../../assets/css/modalUsuario.css"; // Estilo da tabela
import { confirmarAcao, mostrarSucesso, mostrarErro } from "../../components/SweetAlert";

function TabelaCategorias() {
    const [categorias, setCategorias] = useState([]);
    const [search, setSearch] = useState("");
    const [ordenar, setOrdenar] = useState("nome"); // Campo de ordenação
    const [exibir, setExibir] = useState(10); // Número de linhas exibidas por vez
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
                console.error("Erro ao excluir categoria:", error);
                mostrarErro("Erro ao Excluir", "Ocorreu um erro ao excluir a categoria.");
            }
        }
    };
    const handleEditar = (categoria) => {
        setCategoriaSelecionada(categoria);
        setIsModalOpen(true);
    };
    
    return (
        <div className="tabela-container">
            <h1>Gerenciamento de Categorias</h1>
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
                        setCategoriaSelecionada(null); // Garante que é um novo cadastro
                        setIsModalOpen(true);
                    }} 
                >
                    Adicionar Categoria
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
                    {categorias.map((categoria) => (
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

            {/* Modal de Cadastro/Edição */}
            <ModalCadastroCategoria
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setCategoriaSelecionada(null);
                }} 
                categoriaEditada={categoriaSelecionada} // Passa os dados para edição
                onSubmit={handleAddCategoria} // Salva nova categoria ou atualiza
            />
        </div>
    );
}

export default TabelaCategorias;
