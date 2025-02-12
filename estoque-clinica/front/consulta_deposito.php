<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Consulta de Estoque</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="./node_modules/@fortawesome/fontawesome-free/css/all.min.css">



    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <style>
        /* Estilos gerais */
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #f3f7fc;
            color: #333;
            padding: 20px;
        }

        h1 {
            color: #003366;
            font-weight: bold;
            margin-bottom: 30px;
        }

        .container {
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);


        }

        /* Botões */
        .btn-secondary {
            background-color: #6c757d;
            border: none;
            border-radius: 8px;
        }

        .btn-secondary:hover {
            background-color: #5a6268;
        }

        .btn-primary {
            background-color: #0056b3;
            border: none;
            border-radius: 8px;
        }

        .btn-primary:hover {
            background-color: #004494;
        }

        .text-center {
            white-space: nowrap;
            /* Evita quebra de linha para os botões */
        }

        .btn {
            display: inline-block;
            /* Garante que os botões fiquem lado a lado */
            margin-right: 4px;
            /* Espaçamento entre os botões */
            vertical-align: middle;
            /* Centraliza o ícone verticalmente no botão */
        }

        .btn:last-child {
            margin-right: 0;
            /* Remove a margem do último botão para evitar excesso de espaço */
        }

        .btn i {
            vertical-align: middle;
            /* Centraliza o ícone no botão */
        }


        .btn-danger {
            background-color: #dc3545;
            border: none;
            border-radius: 8px;
        }

        .btn-danger:hover {
            background-color: #c82333;
        }

        /* Estilo da tabela */
        table {
            border-radius: 12px;
            width: 100%;
            overflow: hidden;
        }

        .table-responsive {
            width: 100%;
        }

        table thead {
            background-color: #003366;
            color: white;
        }

        table tbody tr:hover {
            background-color: #f1f5f9;
        }

        table tbody td {
            vertical-align: middle;
        }

        /* Botões de ação */
        .action-buttons .btn {
            padding: 6px 10px;
            border-radius: 50%;
            font-size: 16px;
        }

        .btn-edit {
            background-color: #17a2b8;
            color: white;
        }

        .btn-edit:hover {
            background-color: #138496;
        }

        .btn-delete {
            background-color: #dc3545;
            color: white;
        }

        .btn-delete:hover {
            background-color: #c82333;
        }

        /* Paginação */
        #pagination button {
            border: none;
            background-color: #f3f7fc;
            color: #333;
            margin: 0 5px;
            padding: 10px 15px;
            border-radius: 8px;
            transition: all 0.3s ease;
        }

        #pagination button:hover {
            background-color: #003366;
            color: white;
        }
    </style>
</head>

<body>
    <?php include 'navbar.php'; ?> <!-- Menu lateral -->

    <div class="container mt-5">
        <h1 class="text-center">Consulta de Estoque</h1>

        <!-- Botão Voltar -->
        <div class="mb-3">
            <a href="homeadmEV.php" class="btn btn-secondary">
                ← Voltar
            </a>
        </div>

        <!-- Formulário de Filtros -->
        <form id="filterForm" class="row g-3 mb-4">
            <div class="col-md-4">
                <label for="descricao" class="form-label">Descrição do Material:</label>
                <input type="text" class="form-control" id="descricao" placeholder="Digite a descrição">
            </div>
            <div class="col-md-4">
                <label for="tipo_material" class="form-label">Tipo de Material:</label>
                <select class="form-select" id="tipo_material">
                    <option value="" selected>Todos</option>
                </select>
            </div>
            <div class="col-md-4">
                <label for="segmento" class="form-label">Grupo de Mercadorias:</label>
                <select class="form-select" id="segmento">
                    <option value="" selected>Todos</option>
                </select>
            </div>
            <div class="col-12">
                <button type="button" id="buscarButton" class="btn btn-primary w-100">Buscar</button>
            </div>
        </form>

        <!-- Botão para PDF -->
        <div class="text-end mb-3">
            <button type="button" id="exportarPDF" class="btn btn-danger">Gerar Relatório</button>
        </div>

        <!-- Tabela -->
        <div class="table-responsive">
            <table class="table table-striped table-bordered text-center" id="relatorioTable">
                <thead>
                    <tr>
                        <th>Descrição</th>
                        <th>Unidade de Medida</th>
                        <th>Quantidade</th>
                        <th>Depósito</th>
                        <th>Estoque Mínimo</th>
                        <th>Estoque de Segurança</th>
                        <th>Tipo de Material</th>
                        <th>Segmento</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody id="resultTable">
                    <!-- Linhas da tabela serão preenchidas dinamicamente -->
                </tbody>
            </table>
        </div>

        <!-- Paginação -->
        <div id="pagination" class="d-flex justify-content-center mt-3"></div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../assets/js/consulta-deposito.js"></script>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</body>

</html>