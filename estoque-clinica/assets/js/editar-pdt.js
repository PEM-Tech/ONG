document.addEventListener("DOMContentLoaded", function () {
    const produtoId = new URLSearchParams(window.location.search).get('id');
    if (!produtoId) {
        console.error("ID do produto não encontrado na URL.");
        return;
    }

    // Buscar dados do produto para edição
    fetch('../back/controller/editar-pdt.php?action=buscarPorId&id=' + produtoId)
        .then(response => response.json())
        .then(data => {
            if (data && !data.error) {
                console.log('Dados do produto:', data);
                // Preencher os campos do formulário com os dados do produto
                document.getElementById('id').value = data.id;
                document.getElementById('descricao').value = data.descricao || '';
                document.getElementById('quantidade').value = data.quantidade || '';
                document.getElementById('estoque_minimo').value = data.estoque_minimo || '';
                document.getElementById('estoque_seguranca').value = data.estoque_seguranca || '';
                document.getElementById('tipo_material').value = data.tipo_material || '';

                // Preencher o campo "Unidade de Medida"
                fetch('../back/controller/editar-pdt.php?action=listarUnidadesDeMedida')
                    .then(response => response.json())
                    .then(unidades => {
                        console.log('Unidades de Medida:', unidades);
                        const unidadeSelect = document.getElementById('unidade_medida');
                        unidadeSelect.innerHTML = ''; // Limpa as opções atuais
                        unidades.forEach(unidade => {
                            const option = document.createElement('option');
                            option.value = unidade.descricao;
                            option.textContent = unidade.descricao;
                            // Seleciona a unidade original
                            if (unidade.descricao === data.unidade_medida) {
                                option.selected = true;
                            }
                            unidadeSelect.appendChild(option);
                        });
                    })
                    .catch(error => console.error('Erro ao carregar unidades de medida:', error));

                // Preencher o campo "Depósito"
                fetch('../back/controller/editar-pdt.php?action=listarDepositos')
                    .then(response => response.json())
                    .then(depositos => {
                        console.log('Depósitos:', depositos);
                        const depositoSelect = document.getElementById('deposito');
                        depositoSelect.innerHTML = ''; // Limpa as opções atuais
                        depositos.forEach(deposito => {
                            const option = document.createElement('option');
                            option.value = deposito.descricao;
                            option.textContent = deposito.descricao;
                            // Seleciona o depósito original
                            if (deposito.descricao === data.deposito) {
                                option.selected = true;
                            }
                            depositoSelect.appendChild(option);
                        });
                    })
                    .catch(error => console.error('Erro ao carregar depósitos:', error));

                // Preencher o campo "Segmento"
                fetch('../back/controller/editar-pdt.php?action=listarSegmentos')
                    .then(response => response.json())
                    .then(segmentos => {
                        console.log('Segmentos:', segmentos);
                        const segmentoSelect = document.getElementById('segmento');
                        segmentoSelect.innerHTML = ''; // Limpa as opções atuais
                        segmentos.forEach(segmento => {
                            const option = document.createElement('option');
                            option.value = segmento.descricao;
                            option.textContent = segmento.descricao;
                            // Seleciona o segmento original
                            if (segmento.descricao === data.segmento) {
                                option.selected = true;
                            }
                            segmentoSelect.appendChild(option);
                        });
                    })
                    .catch(error => console.error('Erro ao carregar segmentos:', error));
            } else {
                Swal.fire({
                    title: "Erro!",
                    text: "Produto não encontrado.",
                    icon: "error",
                });
            }
        })
        .catch(error => {
            console.error('Erro ao buscar produto:', error);
            Swal.fire({
                title: "Erro!",
                text: "Erro ao buscar produto. Tente novamente.",
                icon: "error",
            });
        });

    // Salvar alterações do produto
    document.getElementById('salvar').addEventListener('click', function () {
        const formData = new FormData(document.getElementById('editar-form'));
        fetch('../back/controller/editar-pdt.php?action=editar', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    title: "Sucesso!",
                    text: "Produto atualizado com sucesso.",
                    icon: "success",
                }).then(() => {
                    window.location.href = './consulta_deposito.php';
                });
            } else {
                Swal.fire({
                    title: "Erro!",
                    text: data.error || "Erro ao atualizar produto. Tente novamente.",
                    icon: "error",
                });
            }
        })
        .catch(error => {
            console.error('Erro ao atualizar produto:', error);
            Swal.fire({
                title: "Erro!",
                text: "Erro ao atualizar produto. Tente novamente.",
                icon: "error",
            });
        });
    });
});
