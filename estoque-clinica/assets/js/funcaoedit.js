document.addEventListener('DOMContentLoaded', function () {
    // Obtenção dos elementos HTML necessários
    const gerenciarFuncoesBtn = document.getElementById('gerenciarFuncoesBtn');
    const gerenciarPaginasBtn = document.getElementById('gerenciarPaginasBtn');
    const funcoesTableBody = document.getElementById('funcoesTableBody');
    const paginasTableBody = document.getElementById('paginasTableBody');
    const adicionarFuncaoBtn = document.getElementById('adicionarFuncaoBtn');
    const adicionarPaginaBtn = document.getElementById('adicionarPaginaBtn');
    
    // Utilitário para mostrar modal
    function mostrarModal(modalId) {
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        } else {
            console.error(`Modal com ID '${modalId}' não encontrado.`);
        }
    }

    // Utilitário para esconder modal
    function esconderModal(modalId) {
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
        }
    }

    // Função para abrir o modal de Gerenciar Funções
    if (gerenciarFuncoesBtn) {
        gerenciarFuncoesBtn.addEventListener('click', function (event) {
            event.preventDefault(); // Evita redirecionamento indesejado
            mostrarModal('modalGerenciarFuncoes');
            carregarFuncoes();
        });
    }

    // Função para abrir o modal de Gerenciar Páginas
    if (gerenciarPaginasBtn) {
        gerenciarPaginasBtn.addEventListener('click', function (event) {
            event.preventDefault(); // Evita redirecionamento indesejado
            mostrarModal('modalGerenciarPaginas');
            carregarPaginas();
        });
    }

    // Função para carregar as funções
    function carregarFuncoes() {
        fetch('../back/controller/funcaoedit.php?action=listar')
            .then(response => response.json())
            .then(data => {
                funcoesTableBody.innerHTML = '';

                if (data.length === 0) {
                    funcoesTableBody.innerHTML = "<tr><td colspan='3' class='text-center'>Nenhuma função encontrada.</td></tr>";
                } else {
                    data.forEach(funcao => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${funcao.nome}</td>
                            <td>${funcao.descricao}</td>
                            <td>
                                <button class="btn btn-warning btn-sm editar-funcao" data-id="${funcao.id}">Editar</button>
                                <button class="btn btn-danger btn-sm excluir-funcao" data-id="${funcao.id}">Excluir</button>
                            </td>
                        `;
                        funcoesTableBody.appendChild(row);
                    });

                    adicionarEventosAosBotoesFuncoes();
                }
            })
            .catch(error => {
                console.error('Erro ao carregar funções:', error);
                Swal.fire('Erro!', 'Erro ao carregar funções.', 'error');
            });
    }

    // Função para carregar as páginas
    function carregarPaginas() {
        fetch('../back/controller/paginaedit.php?action=listar')
            .then(response => response.json())
            .then(data => {
                paginasTableBody.innerHTML = '';

                if (data.length === 0) {
                    paginasTableBody.innerHTML = "<tr><td colspan='2' class='text-center'>Nenhuma página encontrada.</td></tr>";
                } else {
                    data.forEach(pagina => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${pagina.nome}</td>
                            <td>
                                <button class="btn btn-warning btn-sm editar-pagina" data-id="${pagina.id}">Editar</button>
                                <button class="btn btn-danger btn-sm excluir-pagina" data-id="${pagina.id}">Excluir</button>
                            </td>
                        `;
                        paginasTableBody.appendChild(row);
                    });

                    adicionarEventosAosBotoesPaginas();
                }
            })
            .catch(error => {
                console.error('Erro ao carregar páginas:', error);
                Swal.fire('Erro!', 'Erro ao carregar páginas.', 'error');
            });
    }

    // Função para adicionar os eventos aos botões de editar e excluir para funções
    function adicionarEventosAosBotoesFuncoes() {
        document.querySelectorAll('.editar-funcao').forEach(button => {
            button.addEventListener('click', function (event) {
                event.preventDefault(); // Evita redirecionamento indesejado
                const id = this.getAttribute('data-id');
                buscarFuncaoPorId(id);
            });
        });

        document.querySelectorAll('.excluir-funcao').forEach(button => {
            button.addEventListener('click', function (event) {
                event.preventDefault(); // Evita redirecionamento indesejado
                const id = this.getAttribute('data-id');
                excluirFuncao(id);
            });
        });
    }

    // Função para adicionar os eventos aos botões de editar e excluir para páginas
    function adicionarEventosAosBotoesPaginas() {
        document.querySelectorAll('.editar-pagina').forEach(button => {
            button.addEventListener('click', function (event) {
                event.preventDefault(); // Evita redirecionamento indesejado
                const id = this.getAttribute('data-id');
                buscarPaginaPorId(id);
            });
        });

        document.querySelectorAll('.excluir-pagina').forEach(button => {
            button.addEventListener('click', function (event) {
                event.preventDefault(); // Evita redirecionamento indesejado
                const id = this.getAttribute('data-id');
                excluirPagina(id);
            });
        });
    }

    // Função para buscar função por ID e abrir o modal de edição
    function buscarFuncaoPorId(id) {
        fetch(`../back/controller/funcaoedit.php?action=buscar&id=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    const editarNomeFuncao = document.getElementById('editarNomeFuncao');
                    const editarDescricaoFuncao = document.getElementById('editarDescricaoFuncao');
                    const funcaoId = document.getElementById('funcaoId');

                    if (editarNomeFuncao && editarDescricaoFuncao && funcaoId) {
                        editarNomeFuncao.value = data.nome;
                        editarDescricaoFuncao.value = data.descricao;
                        funcaoId.value = data.id;

                        mostrarModal('modalEditarFuncao');
                    } else {
                        console.error('Elementos do formulário de edição não encontrados.');
                        console.log('Verifique se o modal de edição está presente no DOM e se os IDs dos elementos estão corretos.');
                        Swal.fire('Erro!', 'Elementos do formulário de edição não encontrados.', 'error');
                    }
                } else {
                    Swal.fire('Erro!', 'Função não encontrada.', 'error');
                }
            })
            .catch(error => {
                console.error('Erro ao buscar função:', error);
                Swal.fire('Erro!', 'Erro ao buscar função.', 'error');
            });
    }

    // Função para buscar página por ID e abrir o modal de edição
    function buscarPaginaPorId(id) {
        fetch(`../back/controller/paginaedit.php?action=buscar&id=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    // Utilize um prompt simples para editar o nome da página
                    const novoNomePagina = prompt('Digite o novo nome para a página:', data.nome);
                    if (novoNomePagina) {
                        editarPagina(id, novoNomePagina);
                    }
                } else {
                    Swal.fire('Erro!', 'Página não encontrada.', 'error');
                }
            })
            .catch(error => {
                console.error('Erro ao buscar página:', error);
                Swal.fire('Erro!', 'Erro ao buscar página.', 'error');
            });
    }

    // Função para excluir página
    function excluirPagina(id) {
        Swal.fire({
            title: 'Tem certeza?',
            text: "Você não poderá reverter isso!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`../back/controller/paginaedit.php?action=excluir&id=${id}`, {
                    method: 'DELETE'
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            Swal.fire('Excluído!', 'Página excluída com sucesso.', 'success');
                            carregarPaginas();
                        } else {
                            Swal.fire('Erro!', 'Erro ao excluir página.', 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao excluir página:', error);
                        Swal.fire('Erro!', 'Erro ao excluir página.', 'error');
                    });
            }
        });
    }

    // Função para editar página
    function editarPagina(id, nome) {
        fetch(`../back/controller/paginaedit.php?action=editar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, nome })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire('Sucesso!', 'Página editada com sucesso.', 'success');
                    carregarPaginas();
                } else {
                    Swal.fire('Erro!', 'Erro ao editar página.', 'error');
                }
            })
            .catch(error => {
                console.error('Erro ao editar página:', error);
                Swal.fire('Erro!', 'Erro ao editar página.', 'error');
            });
    }

    // Evento para o botão de adicionar página
    if (adicionarPaginaBtn) {
        adicionarPaginaBtn.addEventListener('click', function (event) {
            event.preventDefault(); // Evita redirecionamento indesejado
            const nomePagina = prompt('Digite o nome da nova página:');
            if (nomePagina) {
                fetch('../back/controller/paginaedit.php?action=criar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nome: nomePagina })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            Swal.fire('Sucesso!', 'Página adicionada com sucesso.', 'success');
                            carregarPaginas();
                        } else {
                            Swal.fire('Erro!', 'Erro ao adicionar página.', 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao adicionar página:', error);
                        Swal.fire('Erro!', 'Erro ao adicionar página.', 'error');
                    });
            }
        });
    }

    // Carregar as funções ao iniciar
    carregarFuncoes();
});