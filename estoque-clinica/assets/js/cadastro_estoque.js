$(document).ready(function () {
    // Função para carregar categorias dinâmicas
    function carregarCategorias(categoria, selectElementId) {
        $.ajax({
            url: "../back/controller/estoqueedit.php",
            type: "GET",
            data: {
                action: 'listar',
                categoria: categoria
            },
            success: function (response) {
                try {
                    response = typeof response === "string" ? JSON.parse(response) : response;
                } catch (e) {
                    Swal.fire("Erro!", "Resposta inesperada do servidor.", "error");
                    return;
                }

                if (response.status === "success") {
                    let selectElement = $(`#${selectElementId}`);
                    selectElement.empty(); // Limpar as opções existentes
                    selectElement.append(`<option value="">Selecione...</option>`); // Adicionar opção padrão

                    // Preencher as opções com os dados recebidos
                    response.data.forEach(function (item) {
                        selectElement.append(`<option value="${item.descricao}">${item.descricao}</option>`);
                    });
                } else {
                    Swal.fire("Erro!", response.message, "error");
                }
            },
            error: function () {
                Swal.fire("Erro!", "Erro ao carregar categorias.", "error");
            },
        });
    }

    // Carregar categorias ao abrir a página
    const categorias = [
        { categoria: 'unidade_medida', elemento: 'unidade_medida' },
        { categoria: 'deposito', elemento: 'deposito' },
        { categoria: 'tipo_material', elemento: 'tipo_material' },
        { categoria: 'segmento', elemento: 'segmento' }
    ];

    categorias.forEach(item => {
        carregarCategorias(item.categoria, item.elemento);
    });

    // Voltar para a home
    $(".back-button").on("click", function () {
        if (homeUrl) {
            window.location.href = homeUrl;
        } else {
            alert("URL da home não encontrada.");
        }
    });
});
