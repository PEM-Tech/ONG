$(document).ready(function () {
    // Carregar lista de funcionários
    carregarFuncionarios();
    carregarFuncoes();

    function carregarFuncionarios() {
        $.ajax({
            url: '../back/controller/usuarioedit.php?action=listar',
            type: 'GET',
            success: function (data) {
                const usuarios = JSON.parse(data);
                let tabela = '';
                usuarios.forEach(usuario => {
                    tabela += `
                        <tr>
                            <td>${usuario.id_usuario}</td>
                            <td>${usuario.nome} ${usuario.sobrenome}</td>
                            <td>${usuario.email}</td>
                            <td>${usuario.funcao_nome ? usuario.funcao_nome : 'Função não definida'}</td>
                            <td>
                                <button class="btn btn-warning btn-sm" onclick="abrirModalEditar(${usuario.id_usuario}, '${usuario.nome}', '${usuario.sobrenome}', ${usuario.funcao_id}, '${usuario.email}')">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="confirmarExcluir(${usuario.id_usuario})">Excluir</button>
                            </td>
                        </tr>`;
                });
                $('#funcionarios-list').html(tabela);
            },
            error: function () {
                Swal.fire('Erro!', 'Erro ao carregar a lista de funcionários.', 'error');
            }
        });
    }

    // Carregar funções disponíveis
    function carregarFuncoes() {
        $.ajax({
            url: '../back/controller/usuarioedit.php?action=listar_funcoes',
            type: 'GET',
            success: function (data) {
                const funcoes = JSON.parse(data);
                let opcoes = '';
                funcoes.forEach(funcao => {
                    opcoes += `<option value="${funcao.id}">${funcao.nome}</option>`;
                });
                $('#editFuncao').html(opcoes);
            },
            error: function () {
                Swal.fire('Erro!', 'Erro ao carregar as funções.', 'error');
            }
        });
    }

    // Função para navegar de volta ao painel principal
    window.voltar = function () {
        window.location.href = 'painel-adm.php'; // Página principal do painel
    }

    // Função para cadastrar um novo usuário
    window.cadastrarUsuario = function () {
        window.location.href = 'cadastra.php'; // Página para cadastrar um novo usuário
    }

    // Função para confirmar exclusão com SweetAlert2
    window.confirmarExcluir = function (id) {
        Swal.fire({
            title: 'Tem certeza?',
            text: "Você não poderá reverter isso!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                excluirUsuario(id);
            }
        });
    }

    // Função para excluir um usuário
    function excluirUsuario(id) {
        $.ajax({
            url: '../back/controller/usuarioedit.php',
            type: 'POST',
            data: {
                delete: true,
                id: id
            },
            success: function () {
                Swal.fire(
                    'Excluído!',
                    'O usuário foi excluído com sucesso.',
                    'success'
                )
                carregarFuncionarios();
            },
            error: function () {
                Swal.fire(
                    'Erro!',
                    'Erro ao excluir o usuário.',
                    'error'
                )
            }
        });
    }

    // Abrir o modal de edição com os dados preenchidos
    // Abrir o modal de edição com os dados preenchidos
window.abrirModalEditar = function (id, nome, sobrenome, funcao_id, email) {
    $('#editId').val(id);
    $('#editNome').val(nome);
    $('#editSobrenome').val(sobrenome);
    $('#editFuncao').val(funcao_id);  // Certifique-se de que o valor funcao_id está sendo atribuído corretamente
    $('#editEmail').val(email);
    $('#editModal').modal('show');
    
    // Atualizar o select de funções para garantir que a função do usuário esteja selecionada
    setTimeout(() => {
        $('#editFuncao').val(funcao_id);
    }, 100);  // Utiliza um pequeno delay para garantir que o valor seja selecionado depois do carregamento
}

    // Submeter edição de funcionário
    $('#editForm').submit(function (e) {
        e.preventDefault();

        const id = $('#editId').val();
        const nome = $('#editNome').val();
        const sobrenome = $('#editSobrenome').val();
        const funcao_id = $('#editFuncao').val();  // Agora usamos funcao_id
        const email = $('#editEmail').val();

        $.ajax({
            url: '../back/controller/usuarioedit.php',
            type: 'POST',
            data: {
                edit: true,
                id: id,
                nome: nome,
                sobrenome: sobrenome,
                funcao_id: funcao_id,  // Usamos funcao_id ao enviar
                email: email
            },
            success: function () {
                Swal.fire(
                    'Atualizado!',
                    'Os dados do usuário foram atualizados com sucesso.',
                    'success'
                )
                $('#editModal').modal('hide');
                carregarFuncionarios();
            },
            error: function () {
                Swal.fire(
                    'Erro!',
                    'Erro ao atualizar o funcionário.',
                    'error'
                )
            }
        });
    });
});
