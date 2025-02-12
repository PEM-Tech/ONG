

<?php
session_start();

require '../back/auth.php'; // Caminho para o arquivo auth.php

include('../back/db.php');
include_once('../back/estoqueController.php');

// Inicializa o controlador de estoque
$estoqueController = new EstoqueController();

// Obtém o ID do material a partir da URL
$id = $_GET['id'] ?? null;

if ($id) {
    $material = $estoqueController->buscarMaterialPorId($id);
    if (!$material) {
        echo "Erro: Material não encontrado.";
        exit;
    }
} else {
    echo "Erro: ID do material não fornecido.";
    exit;
}
?>

<!DOCTYPE html>
<html lang="pt-BR">


<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Produto</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>

<body>
    <div class="container mt-5">
    <div class="mb-3">
            <a href="consulta_deposito.php" class="btn btn-secondary">
                ← Voltar
            </a>
        </div>
        <h1 class="text-center mb-4">Editar Produto</h1>

        <!-- Formulário de Edição -->
        <form id="editar-form" method="POST" class="row g-3">
            <input type="hidden" id="id" name="id">

            <!-- Campo Descrição -->
            <div class="col-md-6">
                <label for="descricao" class="form-label">Descrição do Material:</label>
                <input type="text" name="descricao" class="form-control" id="descricao" required>
            </div>

            <!-- Campo Unidade de Medida -->
            <div class="col-md-6">
                <label for="unidade_medida" class="form-label">Unidade de Medida:</label>
                <select name="unidade_medida" class="form-select" id="unidade_medida" required>
                    <!-- Opções serão carregadas dinamicamente -->
                </select>
            </div>

            <!-- Campo Quantidade -->
            <div class="col-md-6">
                <label for="quantidade" class="form-label">Quantidade:</label>
                <input type="number" name="quantidade" class="form-control" id="quantidade" required>
            </div>

            <!-- Campo Depósito -->
            <div class="col-md-6">
                <label for="deposito" class="form-label">Depósito:</label>
                <select name="deposito" class="form-select" id="deposito" required>
                    <!-- Opções serão carregadas dinamicamente -->
                </select>
            </div>

            <!-- Campo Estoque Mínimo -->
            <div class="col-md-6">
                <label for="estoque_minimo" class="form-label">Estoque Mínimo:</label>
                <input type="number" name="estoque_minimo" class="form-control" id="estoque_minimo" required>
            </div>

            <!-- Campo Estoque de Segurança -->
            <div class="col-md-6">
                <label for="estoque_seguranca" class="form-label">Estoque de Segurança:</label>
                <input type="number" name="estoque_seguranca" class="form-control" id="estoque_seguranca" required>
            </div>

            <!-- Campo Tipo de Material -->
            <div class="col-md-6">
                <label for="tipo_material" class="form-label">Tipo de Material:</label>
                <input type="text" name="tipo_material" class="form-control" id="tipo_material" required>
            </div>

            <!-- Campo Segmento -->
            <div class="col-md-6">
                <label for="segmento" class="form-label">Segmento:</label>
                <select name="segmento" class="form-select" id="segmento" required>
                    <!-- Opções serão carregadas dinamicamente -->
                </select>
            </div>

            <!-- Botão de Salvar -->
            <div class="col-12">
                <button type="button" id="salvar" class="btn btn-success w-100">Salvar Alterações</button>
            </div>
        </form>
    </div>
    <script src="../assets/js/editar-pdt.js"></script>
    
<script src="../assets/js/voltar_home.js"></script>
</body>

</html>