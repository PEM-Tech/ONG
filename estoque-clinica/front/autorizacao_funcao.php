<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gerenciar Autorizações de Funções</title>

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
            max-width: 800px;
            margin: auto;
        }
    </style>
</head>

<body>
    <div class="container">
        <!-- Botão Voltar -->
        <div class="mb-3">
            <a href="/estoque-php/front/funcaoedit.php" class="btn btn-secondary">
                ← Voltar
            </a>
        </div>

        <div class="card text-center shadow-sm p-4">
            <div class="card-body">
                <h3 class="card-title">Gerenciar Autorizações de Funções</h3>

                <!-- Filtro de Funções -->
                <div class="form-group mb-3">
                    <label for="filtroFuncao" class="form-label">Filtrar por Função:</label>
                    <select class="form-select" id="filtroFuncao">
                        <option value="todas" selected>Todas</option>
                        <!-- Novas funções serão automaticamente adicionadas aqui pelo JS -->
                    </select>
                </div>

                <!-- Tabela de Permissões -->
                <div class="table-responsive">
                    <table class="table table-striped table-bordered">
                        <thead class="table-dark">
                            <tr id="permissoesTableHeader">
                                <th>Página</th>
                                <th id="funcaoHeader">Função</th>
                            </tr>
                        </thead>
                        <tbody id="permissoesTableBody">
                            <tr>
                                <td colspan="2" class="text-center">Carregando dados...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="mt-3">
                    <button type="button" class="btn btn-primary" id="salvarPermissoesBtn">Salvar Alterações</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- JavaScript para gerenciar as permissões -->
    <script src="../assets/js/autorizacao_funcao.js"></script>
</body>

</html>
