<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel do Administrador</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/painel-adm.css">
</head>

<body>
<?php include 'navbar.php'; ?> <!-- Aqui você inclui o menu lateral -->
    <div class="admin-panel">
        <h3>Configurações de Administrador</h3>
        <p class="text-muted">Selecione uma das opções abaixo para gerenciar as funcionalidades:</p>
        <div class="mt-4">
            <button class="btn btn-primary btn-custom" onclick="navegarPara('usuarios')">Usuários</button>
            <button class="btn btn-primary btn-custom" onclick="navegarPara('estoque')">Estoque</button>
            
        </div>
    </div>

    <script>
        function navegarPara(secao) {
            // Redirecionar para a seção específica
            switch (secao) {
                case 'usuarios':
                    window.location.href = 'usuarioedit.php';
                    break;
                case 'estoque':
                    window.location.href = 'estoqueedit.php';
                    break;
            
            }
        }
    </script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>