document.addEventListener('DOMContentLoaded', function () {
    const buscarButton = document.getElementById('buscarButton');
    const descricaoInput = document.getElementById('descricao');
    const tipoMaterialSelect = document.getElementById('tipo_material');
    const segmentoSelect = document.getElementById('segmento');
    const tbody = document.getElementById('resultTable');
    const pagination = document.getElementById('pagination');

    let paginaAtual = 1;
    function carregarFontAwesome(callback) {
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/js/all.min.js";
        script.defer = true;
        script.onload = callback;
        document.head.appendChild(script);
    }
    // Função para carregar materiais com filtros e paginação
   function carregarMateriais(pagina = 1) {
    const descricao = descricaoInput.value;
    const tipo_material = tipoMaterialSelect.value;
    const segmento = segmentoSelect.value;

    const url = `../back/controller/consulta_deposito.php?action=listar&descricao=${encodeURIComponent(descricao)}&tipo_material=${encodeURIComponent(tipo_material)}&segmento=${encodeURIComponent(segmento)}&pagina=${pagina}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar materiais: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            tbody.innerHTML = '';

            if (!data || !data.materiais || data.materiais.length === 0) {
                tbody.innerHTML = "<tr><td colspan='9' class='text-center'>Nenhum material encontrado.</td></tr>";
            } else {
                data.materiais.forEach(material => {
                    carregarFontAwesome();
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${material.descricao}</td>
                        <td>${material.unidade_medida}</td>
                        <td>${material.quantidade}</td>
                        <td>${material.deposito}</td>
                        <td>${material.estoque_minimo}</td>
                        <td>${material.estoque_seguranca}</td>
                        <td>${material.tipo_material}</td>
                        <td>${material.segmento}</td>
                        <td class="text-center">
                            <button class="btn btn-edit btn-sm me-2" data-id="${material.id}" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-delete btn-sm" data-id="${material.id}" title="Excluir">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });

                adicionarEventosExcluir();
                adicionarEventosEditar();
            }

            atualizarPaginacao(data.totalPaginas, data.paginaAtual);
        })
        .catch(error => {
            console.error('Erro ao carregar materiais:', error);
            tbody.innerHTML = "<tr><td colspan='9' class='text-center text-danger'>Erro ao carregar materiais. Por favor, tente novamente.</td></tr>";
        });
}


    // Atualizar paginação
    function atualizarPaginacao(totalPaginas, paginaAtual) {
        pagination.innerHTML = '';

        for (let i = 1; i <= totalPaginas; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.className = `btn btn-sm ${i === paginaAtual ? 'btn-primary' : 'btn-secondary'}`;
            button.addEventListener('click', () => {
                carregarMateriais(i);
            });
            pagination.appendChild(button);
        }
    }

    // Adicionar evento para excluir material
    function adicionarEventosExcluir() {
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
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
                        excluirMaterial(id);
                    }
                });
            });
        });
    }

    // Função para excluir material
    function excluirMaterial(id) {
        const url = `../back/controller/consulta_deposito.php?action=excluir&id=${id}`;

        fetch(url, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire(
                    'Excluído!',
                    'O material foi excluído com sucesso.',
                    'success'
                );
                carregarMateriais(paginaAtual);
            } else {
                Swal.fire(
                    'Erro!',
                    'Erro ao excluir material.',
                    'error'
                );
            }
        })
        .catch(error => {
            Swal.fire(
                'Erro!',
                'Erro ao excluir material: ' + error.message,
                'error'
            );
        });
    }

    // Adicionar evento para editar material
    function adicionarEventosEditar() {
        document.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                window.location.href = `/estoque-clinica/front/editar-pdt.php?id=${id}`;
            });
        });
    }

    // Evento para o botão de buscar
    buscarButton.addEventListener('click', () => {
        paginaAtual = 1;
        carregarMateriais(paginaAtual);
    });

    // Função para carregar os filtros de tipo de material e segmento
    function carregarFiltros() {
        fetch('../back/controller/consulta_deposito.php?action=listarTiposMaterial')
            .then(response => response.json())
            .then(data => {
                tipoMaterialSelect.innerHTML = '<option value="">Todos</option>';
                data.forEach(tipo => {
                    const option = document.createElement('option');
                    option.value = tipo.descricao;
                    option.textContent = tipo.descricao;
                    tipoMaterialSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Erro ao carregar tipos de material:', error));

        fetch('../back/controller/consulta_deposito.php?action=listarSegmentos')
            .then(response => response.json())
            .then(data => {
                segmentoSelect.innerHTML = '<option value="">Todos</option>';
                data.forEach(segmento => {
                    const option = document.createElement('option');
                    option.value = segmento.descricao;
                    option.textContent = segmento.descricao;
                    segmentoSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Erro ao carregar segmentos:', error));
    }

    // Carregar os dados iniciais
    carregarFiltros();
    carregarMateriais();
});
