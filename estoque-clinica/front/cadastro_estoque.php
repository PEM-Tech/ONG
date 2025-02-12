<?php

require '../back/auth.php'; // Caminho para o arquivo auth.php
?>
<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro de Estoque</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link  href="../assets/css/cadastro.css">
    <style>/* Estilos gerais */
body {
    font-family: 'Poppins', sans-serif;
    background-color: #f3f7fc; /* Um azul suave para o fundo */
    color: #333;
    padding: 20px;
}

h1 {
    color: #2a2a2a;
    font-weight: 700;
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 20px;
}

.container {
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); /* Sombra para destacar */
    padding: 30px;
    max-width: 900px;
    margin: 20px auto;
}

/* Estilo do botão Voltar */
.btn-secondary {
    background-color: #4c5566;
    border: none;
    color: #fff;
    font-weight: bold;
    padding: 10px 20px;
    border-radius: 8px;
    transition: all 0.3s ease-in-out;
}

.btn-secondary:hover {
    background-color: #333b48;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Estilo dos campos do formulário */
.form-label {
    font-weight: 600;
    color: #4c5566;
    margin-bottom: 8px;
}

.form-control,
.form-select {
    padding: 12px;
    border: 1px solid #d1d9e0;
    border-radius: 8px;
    box-shadow: none;
    transition: all 0.3s ease-in-out;
    font-size: 1rem;
}

.form-control:focus,
.form-select:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
    outline: none;
}

.form-control:invalid {
    border-color: #dc3545;
    box-shadow: 0 0 5px rgba(220, 53, 69, 0.3);
}

/* Botão de Cadastrar */
.btn-success {
    background-color: #28a745;
    border: none;
    color: #fff;
    font-size: 1.2rem;
    padding: 12px 25px;
    border-radius: 8px;
    font-weight: bold;
    margin-top: 15px;
    transition: all 0.3s ease-in-out;
    width: 100%;
}

.btn-success:hover {
    background-color: #218838;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Mensagens de feedback */
.alert {
    font-weight: bold;
    text-align: center;
    margin-top: 20px;
    border-radius: 8px;
}

.alert-success {
    color: #155724;
    background-color: #d4edda;
    border-color: #c3e6cb;
}

.alert-danger {
    color: #721c24;
    background-color: #f8d7da;
    border-color: #f5c6cb;
}

/* Lista de sugestões */
#sugestoesDeposito {
    z-index: 1000;
    max-height: 200px;
    overflow-y: auto;
    width: 100%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}

#sugestoesDeposito .list-group-item {
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
}

#sugestoesDeposito .list-group-item:hover {
    background-color: #f1f5f9;
}
</style>
</head>

<body>
<?php include 'navbar.php'; ?> <!-- Aqui você inclui o menu lateral -->
    <div class="container mt-5">
        <h1 class="text-center mb-4">Cadastro de Estoque</h1>

        <!-- Botão Voltar para a Home -->
        <div class="text-start mb-3">
        <button class="back-button">Voltar para Home</button>
        </div>

        <!-- Formulário para cadastro de estoque -->
        <form id="produtoForm" action="../back/controller/cadastro-estoque.php" method="POST" class="row g-3">
    <!-- Campo: Descrição do Material -->
    <div class="col-md-6 position-relative">
        <label for="descricao" class="form-label">Descrição do Material:</label>
        <input type="text" name="descricao" class="form-control" id="descricao" required autocomplete="off">
        <ul id="sugestoesDescricao" class="list-group position-absolute"></ul>
    </div>

    <!-- Campo: Unidade de Medida -->
    <div class="col-md-6">
        <label for="unidade_medida" class="form-label">Unidade de Medida:</label>
        <select name="unidade_medida" class="form-select" id="unidade_medida" data-categoria="unidade_medida" required>
            <option value="" selected>Carregando...</option>
        </select>
    </div>

    <!-- Campo: Quantidade -->
    <div class="col-md-6">
        <label for="quantidade" class="form-label">Quantidade:</label>
        <input type="number" name="quantidade" class="form-control" id="quantidade" required>
    </div>

    <!-- Campo: Depósito -->
    <div class="col-md-6 position-relative">
        <label for="deposito" class="form-label">Depósito:</label>
        <select name="deposito" class="form-select" id="deposito" data-categoria="deposito" required>
            <option value="" selected>Carregando...</option>
        </select>
    </div>

    <!-- Campo: Estoque Mínimo -->
    <div class="col-md-6">
        <label for="estoque_minimo" class="form-label">Estoque Mínimo:</label>
        <input type="number" name="estoque_minimo" class="form-control" id="estoque_minimo" required>
    </div>

    <!-- Campo: Estoque de Segurança -->
    <div class="col-md-6">
        <label for="estoque_seguranca" class="form-label">Estoque de Segurança:</label>
        <input type="number" name="estoque_seguranca" class="form-control" id="estoque_seguranca" required>
    </div>

    <!-- Campo: Tipo de Material -->
    <div class="col-md-6">
        <label for="tipo_material" class="form-label">Tipo de Material:</label>
        <select name="tipo_material" class="form-select" id="tipo_material" data-categoria="tipo_material" required>
            <option value="" selected>Carregando...</option>
        </select>
    </div>

    <!-- Campo: Grupo de Mercadorias -->
    <div class="col-md-6">
        <label for="segmento" class="form-label">Grupo de Mercadorias:</label>
        <select name="segmento" class="form-select" id="segmento" data-categoria="segmento" required>
            <option value="" selected>Carregando...</option>
        </select>
    </div>

    <!-- Campo: Validade -->
    <div class="col-md-6">
        <label for="validade" class="form-label">Validade:</label>
        <input type="date" name="validade" class="form-control" id="validade" required>
    </div>

    <!-- Campo: Preço -->
    <div class="col-md-6">
        <label for="preco" class="form-label">Preço (R$):</label>
        <input type="number" step="0.01" name="preco" class="form-control" id="preco" required>
    </div>

    <!-- Botão de submissão -->
    <div class="col-12">
        <button type="submit" name="action" value="cadastrar" class="btn btn-success w-100">Cadastrar</button>
    </div>
</form>

        <!-- Área para exibir mensagens de sucesso ou erro -->
        <?php
        if (isset($_GET['status'])) {
            if ($_GET['status'] == 'success') {
                echo "<p class='alert alert-success mt-3'>Material cadastrado com sucesso!</p>";
            } elseif ($_GET['status'] == 'error') {
                echo "<p class='alert alert-danger mt-3'>Erro ao cadastrar o material. Tente novamente.</p>";
            }
        }
        ?>
    </div>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../assets/js/cadastro_estoque.js"></script>
    <script>
    let homeUrl = '<?php echo $_SESSION['homeUrl'] ?? ""; ?>';
</script>
<script src="../assets/js/voltar_home.js"></script>

</body>

</html>