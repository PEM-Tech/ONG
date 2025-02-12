document.addEventListener('DOMContentLoaded', function () {
    buscarNotificacoes();

    // Função para buscar notificações do backend
    function buscarNotificacoes() {
        fetch('../../back/controller/painel_estoque.php?action=listarNotificacoes')
        .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar notificações, status: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                const tabelaCorpo = document.getElementById('tabela-notificacoes-corpo');
                tabelaCorpo.innerHTML = ''; // Limpa as notificações atuais

                if (data.length > 0) {
                    data.forEach(notificacao => {
                        const linha = document.createElement('tr');
                        linha.innerHTML = `
                            <td>${notificacao.id}</td>
                            <td>${notificacao.produto_id}</td>
                            <td>${notificacao.mensagem}</td>
                            <td>${new Date(notificacao.data_notificacao).toLocaleString()}</td>
                            <td><button onclick='abrirModal(${JSON.stringify(notificacao)})'>Visualizar</button></td>
                        `;
                        tabelaCorpo.appendChild(linha);
                    });
                } else {
                    tabelaCorpo.innerHTML = '<tr><td colspan="5">Nenhuma notificação no momento.</td></tr>';
                }
            })
            .catch(error => {
                console.error('Erro ao buscar notificações:', error);
                alert('Erro ao buscar notificações. Tente novamente mais tarde.');
            });
    }

    // Função para abrir o modal com as informações da notificação
    window.abrirModal = function (notificacao) {
        const modalMensagem = document.getElementById('modalMensagem');
        modalMensagem.innerText = notificacao.mensagem;
        document.getElementById('modalNotificacao').style.display = 'block';
    };

    // Função para fechar o modal
    window.fecharModal = function () {
        document.getElementById('modalNotificacao').style.display = 'none';
    };

    // Função para enviar o email ao supervisor
    window.enviarEmailSupervisor = function () {
        alert('Email enviado para o supervisor com sucesso!');
        fecharModal();
    };
});
