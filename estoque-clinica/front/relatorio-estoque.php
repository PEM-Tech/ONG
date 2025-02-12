

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Estoque</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="../assets/css/style.css">
    <script src="https://cdn.plot.ly/plotly-2.16.1.min.js"></script>
    <script src="../assets/js/relatorio-estoque.js" defer></script>
</head>
<body>
    <?php include 'navbar.php'; ?>
    <div class="container mt-5">
        <h1 class="text-center mb-4">Relatório de Estoque</h1>
        <div class="row">
            <!-- Gráfico 1 -->
            <div class="col-lg-6 mb-4">
                <div class="card">
                    <div class="card-header text-center fw-bold">Itens Abaixo do Estoque Mínimo</div>
                    <div class="card-body">
                        <div id="grafico1"></div>
                    </div>
                </div>
            </div>
            <!-- Gráfico 2 -->
            <div class="col-lg-6 mb-4">
                <div class="card">
                    <div class="card-header text-center fw-bold">Distribuição de Estoque por Depósito</div>
                    <div class="card-body">
                        <div id="grafico2"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <!-- Gráfico 3 -->
            <div class="col-lg-12 mb-4">
                <div class="card">
                    <div class="card-header text-center fw-bold">Produtos Próximos à Validade</div>
                    <div class="card-body">
                        <div id="grafico3"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Bootstrap Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
