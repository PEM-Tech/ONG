import React, { useState, useEffect } from "react";
import usuarioService from "../../services/usuarioService"; // Service para comunicação com o backend
import ModalCadastroUsuario from "./CadastroUsuarios"; // Import do modal
import "../../assets/css/usuarios.css"; // Estilo da tabela
import { confirmarAcao, mostrarSucesso, mostrarErro } from "../../components/SweetAlert";
import { useNavigate } from "react-router-dom";

function TabelaUsuarios() {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [search, setSearch] = useState("");
    const [ordenar, setOrdenar] = useState("nome"); // Campo de ordenação
    const [recordsPerPage, setRecordsPerPage] = useState(10); // Número de registros por página
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado do modal
    const [usuarioSelecionado, setUsuarioSelecionado] = useState(null); // Armazena o usuário para edição

    useEffect(() => {
        carregarUsuarios();
    }, []);

    const carregarUsuarios = async () => {
        try {
            const data = await usuarioService.getAllUsuarios();
            setUsuarios(data);
        } catch (error) {
            mostrarErro("Erro ao buscar usuários", "Não foi possível carregar a lista de usuários.");
        }
    };

    // Função chamada ao adicionar ou editar um usuário
    const handleAddUsuario = async (usuario) => {
        const confirmacao = await confirmarAcao(
            usuarioSelecionado ? "Confirmar atualização?" : "Confirmar cadastro?",
            usuarioSelecionado ? "Deseja realmente atualizar os dados deste usuário?" : "Deseja realmente cadastrar este usuário?"
        );

        if (!confirmacao) return;

        try {
            // Cria uma cópia dos dados para evitar modificar o estado diretamente
            const usuarioParaEnviar = { ...usuario };

            // Se o campo de senha estiver vazio, removê-lo da requisição
            if (!usuarioParaEnviar.senha) {
                delete usuarioParaEnviar.senha;
            }

            if (usuarioSelecionado) {
                await usuarioService.atualizarUsuario(usuarioSelecionado.id, usuarioParaEnviar);
                mostrarSucesso("Usuário atualizado!", "Os dados foram atualizados com sucesso.");
            } else {
                await usuarioService.criarUsuario(usuarioParaEnviar);
                mostrarSucesso("Usuário cadastrado!", "O usuário foi adicionado com sucesso.");
            }

            setIsModalOpen(false);
            setUsuarioSelecionado(null);
            carregarUsuarios();
        } catch (error) {
            mostrarErro("Erro ao salvar", "Houve um problema ao salvar o usuário.");
        }
    };

    const handleExcluir = async (id) => {
        const confirmado = await confirmarAcao("Tem certeza?", "Essa ação não pode ser desfeita!");

        if (confirmado) {
            try {
                await usuarioService.deletarUsuario(id);
                setUsuarios((prev) => prev.filter((user) => user.id !== id)); // Atualiza a lista após excluir
                mostrarSucesso("Usuário Excluído", "O usuário foi removido com sucesso!");
            } catch (error) {
                mostrarErro("Erro ao Excluir", "Ocorreu um erro ao excluir o usuário.");
            }
        }
    };

    const handleEditar = (usuario) => {
        setUsuarioSelecionado(usuario);
        setIsModalOpen(true);
    };

    // 🔹 Filtrando e ordenando usuários
    const usuariosFiltrados = usuarios
        .filter((usuario) => usuario.nome.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => (a[ordenar] > b[ordenar] ? 1 : -1));

    // 🔹 Paginação: cálculo dos registros na página atual
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = usuariosFiltrados.slice(indexOfFirstRecord, indexOfLastRecord);

    // 🔹 Cálculo do total de páginas
    const totalPages = Math.ceil(usuariosFiltrados.length / recordsPerPage);

    // 🔹 Funções de navegação
    const goToFirstPage = () => setCurrentPage(1);
    const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const goToLastPage = () => setCurrentPage(totalPages);

    return (
        <div className="tabela-container">
            <div className="title-homeusuarios">
            <button className="back-button-tipoconsulta" onClick={() => navigate(-1)}>⬅ Voltar</button>    
            <h1>Gerenciamento de Usuários</h1>
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
                    <option value="email">Ordenar por Email</option>
                </select>

                <select value={recordsPerPage} onChange={(e) => setRecordsPerPage(Number(e.target.value))}>
                    <option value={5}>Exibir 5</option>
                    <option value={10}>Exibir 10</option>
                    <option value={20}>Exibir 20</option>
                </select>

                <button
                    className="botao-adicionar"
                    onClick={() => {
                        setUsuarioSelecionado(null);
                        setIsModalOpen(true);
                    }}
                >
                    Adicionar Usuário
                </button>
            </div>

            {/* Tabela de usuários */}
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Permissão</th>
                        <th>Desabilitado</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRecords.map((usuario) => (
                        <tr key={usuario.id}>
                            <td>{usuario.nome}</td>
                            <td>{usuario.email}</td>
                            <td>{usuario.permissao}</td>
                            <td>{usuario.desabilitado ? "Sim" : "Não"}</td>
                            <td>
                                <button onClick={() => handleEditar(usuario)}>✏️</button>
                                <button onClick={() => handleExcluir(usuario.id)}>❌</button>
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
            <ModalCadastroUsuario
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setUsuarioSelecionado(null);
                }}
                usuarioEditado={usuarioSelecionado}
                onSubmit={handleAddUsuario}
            />
        </div>
    );
}

export default TabelaUsuarios;
