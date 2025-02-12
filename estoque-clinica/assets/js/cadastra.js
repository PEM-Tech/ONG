$(document).ready(function () {
    // Carregar as funções disponíveis e preencher o campo select
    function carregarFuncoes() {
        $.ajax({
            url: '../back/controller/usuario.php?action=listar_funcoes',
            type: 'GET',
            success: function (data) {
                const funcoes = JSON.parse(data);
                let opcoes = '<option value="" disabled selected>Selecione uma função</option>';
                funcoes.forEach(funcao => {
                    opcoes += `<option value="${funcao.id}">${funcao.nome}</option>`;
                });
                $('#sr_funcao').html(opcoes);
            },
            error: function () {
                Swal.fire('Erro!', 'Erro ao carregar as funções.', 'error');
            }
        });
    }

    // Chamar a função para carregar as funções ao iniciar
    carregarFuncoes();
});
