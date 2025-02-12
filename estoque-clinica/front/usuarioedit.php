<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administração de Funcionários</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@sweetalert2/theme-bootstrap-4/bootstrap-4.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/usuarioedit.css">
</head>

<body>
<?php include 'navbar.php'; ?> <!-- Aqui você inclui o menu lateral -->

    <div class="container my-5">
             <!-- Botão Voltar -->
     <div class="mb-3">
            <a href="painel-adm.php" class="btn btn-secondary">
                ← Voltar
            </a>
        </div>
        <h2 class="text-center mb-4 fw-bold">Administração de Funcionários</h2>
        <div class="btn-section">
            <button class="btn btn-outline-secondary" onclick="voltar()">Voltar</button>
            <button class="btn btn-primary" onclick="cadastrarUsuario()">Cadastrar Novo Usuário</button>
        </div>
        <div class="table-responsive mt-4">
            <table class="table table-striped table-hover align-middle">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Função</th>
                        <th class="text-center">Ações</th>
                    </tr>
                </thead>
                <tbody id="funcionarios-list">
                    <!-- O conteúdo será preenchido dinamicamente pelo JavaScript -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- Modal de Edição -->
    <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editModalLabel">Editar Funcionário</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="editForm">
                        <input type="hidden" id="editId">
                        <div class="mb-3">
                            <label for="editNome" class="form-label">Nome</label>
                            <input type="text" class="form-control" id="editNome" placeholder="Digite o nome" required>
                        </div>
                        <div class="mb-3">
                            <label for="editSobrenome" class="form-label">Sobrenome</label>
                            <input type="text" class="form-control" id="editSobrenome" placeholder="Digite o sobrenome" required>
                        </div>
                        <div class="mb-3">
                            <label for="editFuncao" class="form-label">Função</label>
                            <select id="editFuncao" name="funcao_id" class="form-select" required>
                                <!-- Conteúdo dinâmico -->
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="editEmail" class="form-label">Email</label>
                            <input type="email" class="form-control" id="editEmail" placeholder="Digite o email" required>
                        </div>
                        <div class="text-end">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Salvar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <footer>
        <p>&copy; 2024 Administração de Funcionários. Todos os direitos reservados.</p>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="../assets/js/usuarioedit.js"></script>
</body>

</html>