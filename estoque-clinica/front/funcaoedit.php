<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gerenciar Funções e Páginas</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- SweetAlert2 -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <style>
        body {
            background-color: #f8f9fa;
        }

        .container {
            margin-top: 50px;
        }

        .card {
            max-width: 600px;
            margin: auto;
        }

        .modal-lg {
            max-width: 80%;
        }
    </style>
</head>

<body>
    <div class="container">
        <!-- Botão Voltar -->
        <div class="mb-3">
            <a href="painel-adm.php" class="btn btn-secondary">
                ← Voltar
            </a>
        </div>

        <div class="card text-center shadow-sm p-4">
            <div class="card-body">
                <h3 class="card-title">Gerenciar Funções e Páginas</h3>
                <p class="card-text">Selecione uma das opções abaixo para gerenciar as funcionalidades:</p>
                <button class="btn btn-primary m-2" id="gerenciarFuncoesBtn">Gerenciar Funções</button>
              
                <button class="btn btn-primary m-2">Autorização da Função</button>
                </a>
            </div>
        </div>
    </div>

    <!-- Modal para Gerenciar Funções -->
    <div class="modal fade" id="modalGerenciarFuncoes" tabindex="-1" aria-labelledby="modalFuncoesLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalFuncoesLabel">Gerenciar Funções</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="table-responsive">
                        <table class="table table-striped table-bordered">
                            <thead class="table-dark">
                                <tr>
                                    <th>Nome da Função</th>
                                    <th>Descrição</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody id="funcoesTableBody">
                                <tr>
                                    <td colspan="3" class="text-center">Carregando dados...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    <button type="button" class="btn btn-primary" id="adicionarFuncaoBtn">Adicionar Nova Função</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para Gerenciar Páginas -->
    <div class="modal fade" id="modalGerenciarPaginas" tabindex="-1" aria-labelledby="modalPaginasLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalPaginasLabel">Gerenciar Páginas</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="table-responsive">
                        <table class="table table-striped table-bordered">
                            <thead class="table-dark">
                                <tr>
                                    <th>Nome da Página</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody id="paginasTableBody">
                                <tr>
                                    <td colspan="2" class="text-center">Carregando dados...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    <button type="button" class="btn btn-primary" id="adicionarPaginaBtn">Adicionar Nova Página</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <!-- JavaScript para Gerenciar Funções e Páginas -->
    <script src="../assets/js/funcaoedit.js"></script>
</body>

</html>