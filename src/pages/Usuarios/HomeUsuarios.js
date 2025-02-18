import React, { useState, useEffect } from "react";
import usuarioService from "../../services/usuarioService"; // Service para comunicação com o backend
import ModalCadastroUsuario from "./CadastroUsuarios"; // Import do modal
import "../../assets/css/usuarios.css"; // Estilo da tabela
import { confirmarAcao, mostrarSucesso, mostrarErro } from "../../components/SweetAlert";


function TabelaUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [search, setSearch] = useState("");
    const [ordenar, setOrdenar] = useState("nome"); // Campo de ordenação
    const [exibir, setExibir] = useState(10); // Número de linhas exibidas por vez
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
            if (usuarioSelecionado) {
                await usuarioService.atualizarUsuario(usuarioSelecionado.id, usuario);
                mostrarSucesso("Usuário atualizado!", "Os dados foram atualizados com sucesso.");
            } else {
                await usuarioService.criarUsuario(usuario);
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
                console.error("Erro ao excluir usuário:", error);
                mostrarErro("Erro ao Excluir", "Ocorreu um erro ao excluir o usuário.");
            }
        }
    };
    const handleEditar = (usuario) => {
        setUsuarioSelecionado(usuario);
        setIsModalOpen(true);
    };
    

    return (
        <div className="tabela-container">
            <h1>Gerenciamento de Usuários</h1>
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
                    <option value="email">Ordenar por Email</option>
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
                        setUsuarioSelecionado(null); // Garante que é um novo cadastro
                        setIsModalOpen(true);
                    }} 
                >
                    Adicionar Usuário
                </button>
            </div>
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
                    {usuarios.map((usuario) => (
                        <tr key={usuario.id}>
                            <td>{usuario.nome}</td>
                            <td>{usuario.email}</td>
                            <td>{usuario.permissao}</td>
                            <td>{usuario.desabilitado}</td>
                            <td>
                                <button onClick={() => handleEditar(usuario)}>✏️</button>
                                <button onClick={() => handleExcluir(usuario.id)}>❌</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal de Cadastro/Edição */}
            <ModalCadastroUsuario
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setUsuarioSelecionado(null);
                }} 
                usuarioEditado={usuarioSelecionado} // Passa os dados para edição
                onSubmit={handleAddUsuario} // Salva novo usuário ou atualiza
            />
        </div>
    );
}

export default TabelaUsuarios;
