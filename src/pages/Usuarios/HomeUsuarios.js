import React, { useState, useEffect } from "react";
import usuarioService from "../../services/usuarioService"; // Service para comunicação com o backend
import "../../assets/css/usuarios.css"; // Estilo da tabela

function TabelaUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [search, setSearch] = useState("");
    const [ordenar, setOrdenar] = useState("nome"); // Campo de ordenação
    const [exibir, setExibir] = useState(10); // Número de linhas exibidas por vez

    useEffect(() => {
        // Busca os usuários no backend
        const fetchUsuarios = async () => {
            try {
                const data = await usuarioService.getAllUsuarios();
                setUsuarios(data);
            } catch (error) {
                console.error("Erro ao buscar usuários:", error);
            }
        };
        fetchUsuarios();
    }, []);

    // Lógica para filtrar e ordenar os usuários
    const usuariosFiltrados = usuarios
        .filter((usuario) =>
            usuario.nome.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            if (ordenar === "nome") return a.nome.localeCompare(b.nome);
            if (ordenar === "email") return a.email.localeCompare(b.email);
            return 0;
        })
        .slice(0, exibir);

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
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Permissão</th>
                        <th>Desabilitado</th>
                        <th>Ações</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {usuariosFiltrados.map((usuario) => (
                        <tr key={usuario.id}>
                            <td>{usuario.nome}</td>
                            <td>{usuario.email}</td>
                            <td>{usuario.telefone || "Não informado"}</td>
                            <td>{usuario.funcao}</td>
                            <td>
                                <button onClick={() => console.log("Editar", usuario.id)}>✏️</button>
                                <button onClick={() => console.log("Excluir", usuario.id)}>❌</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TabelaUsuarios;
