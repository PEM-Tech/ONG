<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Configurações do Estoque</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@sweetalert2/theme-bootstrap-4/bootstrap-4.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <style>
        /* Centralizar e estilizar caixa principal */
        .estoque-box {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            text-align: center;
        }

        /* Botões principais */
        .estoque-buttons .btn {
            margin: 10px;
            padding: 10px 20px;
            border-radius: 5px;
            transition: all 0.3s ease;
        }

        .estoque-buttons .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        /* Botão Voltar */
        .btn-secondary {
            background-color: #95a5a6;
            color: white;
        }

        .btn-secondary:hover {
            background-color: #7f8c8d;
        }

        /* Botões principais */
        .btn-primary {
            background-color: #3498db;
            color: white;
        }

        .btn-primary:hover {
            background-color: #2980b9;
        }

        /* Cabeçalhos dos modais */
        .modal-header {
            background-color: #f1f1f1;
            border-bottom: 2px solid #ddd;
        }

        .modal-title {
            color: #34495e;
        }

        /* Botões dos modais */
        .modal-footer .btn {
            padding: 10px 20px;
            border-radius: 5px;
        }

        /* Formulários dentro dos modais */
        form input {
            border-radius: 5px;
            padding: 10px;
        }

        .text-end button {
            margin-left: 10px;
        }
    </style>
</head>

<body>
    <div class="container my-5">
        <!-- Botão Voltar -->
        <div class="mb-3">
            <a href="painel-adm.php" class="btn btn-secondary">
                <i class="fas fa-arrow-left"></i> Voltar
            </a>
        </div>

        <!-- Caixa principal -->
        <div class="estoque-box">
            <h2>Configurações do Estoque</h2>
            <p>Selecione uma das categorias abaixo para gerenciar:</p>
            <div class="estoque-buttons">
                <button class="btn btn-primary" id="btnUnidadeMedida" onclick="abrirModal('unidade_medida')">
                    <i class="fas fa-balance-scale"></i> Unidade de Medida
                </button>
                <button class="btn btn-primary" id="btnDeposito" onclick="abrirModal('deposito')">
                    <i class="fas fa-warehouse"></i> Depósito
                </button>
                <button class="btn btn-primary" id="btnSegmento" onclick="abrirModal('segmento')">
                    <i class="fas fa-stream"></i> Segmento
                </button>
                <button class="btn btn-primary" id="btnTipoMaterial" onclick="abrirModal('tipo_material')">
                    <i class="fas fa-box"></i> Tipo de Material
                </button>
            </div>
        </div>
    </div>

    <!-- Modal para Gerenciar Itens -->
    <div class="modal fade" id="manageModal" tabindex="-1" aria-labelledby="manageModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="manageModalLabel">Gerenciar Itens</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div id="modalContent">
                        <!-- Conteúdo dinâmico será preenchido aqui -->
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="fas fa-times"></i> Fechar
                    </button>
                    <button type="button" class="btn btn-primary" id="addForm" data-bs-toggle="modal" data-bs-target="#addModal">
                        <i class="fas fa-plus"></i> Adicionar Novo
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para Adicionar Novo Item -->
    <div class="modal fade" id="addModal" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addModalLabel"><i class="fas fa-plus"></i> Adicionar Novo Item</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="addFormModal">
                        <div class="mb-3">
                            <label for="addDescricaoModal" class="form-label">Descrição</label>
                            <input type="text" class="form-control" id="addDescricaoModal" required>
                        </div>
                        <input type="hidden" id="addCategoria">
                        <div class="text-end">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-check"></i> Adicionar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para Edição -->
    <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editModalLabel"><i class="fas fa-pencil-alt"></i> Editar Item</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="editForm">
                        <input type="hidden" id="editId">
                        <input type="hidden" id="editCategoria">
                        <div class="mb-3">
                            <label for="editDescricaoModal" class="form-label">Descrição</label>
                            <input type="text" class="form-control" id="editDescricaoModal" required>
                        </div>
                        <div class="text-end">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-check"></i> Salvar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="../assets/js/estoqueedit.js"></script>
</body>

</html>
