<?php
session_start();
require '../back/auth.php'; // Caminho para o arquivo auth.php
?>

<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home - Sistema de Estoque</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #f5f8fa;
            color: #333;
        }

        header {
            background: linear-gradient(135deg, #003366, #0066cc);
            color: #fff;
            padding: 60px 0;
        }

        header h1 {
            font-size: 3rem;
            font-weight: 600;
        }

        header p {
            font-size: 1.2rem;
        }

        header a.btn-primary {
            background-color: #0056b3;
            border-color: #004494;
        }

        header a.btn-primary:hover {
            background-color: #003366;
            border-color: #00254d;
        }

        header a.btn-outline-secondary {
            border-color: #ffffff;
            color: #ffffff;
        }

        header a.btn-outline-secondary:hover {
            background-color: #ffffff;
            color: #003366;
        }

        section.container {
            padding: 40px 0;
        }

        section h3 {
            color: #003366;
            font-size: 1.5rem;
            margin-bottom: 15px;
        }

        footer {
            background-color: #003366;
            color: #fff;
            padding: 20px 0;
            text-align: center;
        }

        footer a {
            color: #00bfff;
            text-decoration: none;
        }

        footer a:hover {
            text-decoration: underline;
        }

        .content {
            padding: 20px;
        }




        .card {
            border: none;
            border-radius: 10px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s, box-shadow 0.3s;
            background: #ffffff;
            padding: 20px;
        }

        .card h3 {
            color: #003366;
            font-size: 1.5rem;
            margin-bottom: 15px;
        }

        .card p {
            color: #555;
            font-size: 1rem;
        }

        /* Efeito de hover com sombra preta */
        .hover-card:hover {
            transform: translateY(-10px);
            box-shadow: 0px 12px 18px rgba(0, 0, 0, 0.3);
        }
    </style>
</head>

<body>

    <?php include 'navbar.php'; ?> <!-- Aqui você inclui o menu lateral -->

    <div class="content">
        <!-- SweetAlert para exibir erro -->
        <?php
        if (isset($_GET['error']) && $_GET['error'] === 'no_permission') {
            echo "<script>
            document.addEventListener('DOMContentLoaded', function() {
                Swal.fire({
                    icon: 'error',
                    title: 'Acesso Negado',
                    text: 'Você não tem permissão para acessar essa página.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    const url = new URL(window.location);
                    url.searchParams.delete('error');
                    window.history.replaceState(null, '', url);
                });
            });
            </script>";
        }
        ?>

        <!-- Mensagem de Status -->
        <?php
        if (isset($_GET['status'])) {
            if ($_GET['status'] == 'success') {
                echo "<script>alert('Material cadastrado com sucesso!');</script>";
            } elseif ($_GET['status'] == 'error') {
                $message = isset($_GET['message']) ? urldecode($_GET['message']) : 'Erro ao cadastrar material.';
                echo "<script>alert('Erro: " . htmlspecialchars($message) . "');</script>";
            }
        }
        ?>

        <!-- Seção principal -->
        <header class="text-center">
            <div class="container">
                <h1>Bem-vindo ao Sistema de Estoque</h1>
                <p>Gerencie facilmente o seu estoque, cadastre materiais e acompanhe relatórios de desempenho.</p>
                <a href="cadastro_estoque.php" class="btn btn-primary btn-lg mt-3">Cadastrar Material</a>
                <a href="consulta_deposito.php" class="btn btn-outline-secondary btn-lg mt-3">Consultar Depósito</a>
            </div>
        </header>

        <!-- Seções adicionais -->
<section class="container my-5">
    <div class="row text-center">
        <div class="col-md-4">
            <a href="cadastro_estoque.php" class="text-decoration-none">
                <div class="card hover-card">
                    <div class="card-body">
                        <h3>Cadastro Simples</h3>
                        <p>Cadastre novos materiais e acompanhe o estoque de forma intuitiva e organizada.</p>
                    </div>
                </div>
            </a>
        </div>
        <div class="col-md-4">
            <a href="relatorio-estoque.php" class="text-decoration-none">
                <div class="card hover-card">
                    <div class="card-body">
                        <h3>Relatórios Detalhados</h3>
                        <p>Visualize relatórios completos para monitorar o desempenho e manter o controle do estoque.</p>
                    </div>
                </div>
            </a>
        </div>
        <div class="col-md-4">
            <a href="consulta_deposito.php" class="text-decoration-none">
                <div class="card hover-card">
                    <div class="card-body">
                        <h3>Facilidade de Acesso</h3>
                        <p>Acesse rapidamente as informações com uma interface limpa e funcional.</p>
                    </div>
                </div>
            </a>
        </div>
    </div>
</section>

</div> <!-- Fechando a div da content -->


    <!-- Rodapé -->
    <footer>
        <p>&copy; 2024 Sistema de Estoque. Todos os direitos reservados. <a href="#">Política de Privacidade</a> • <a href="#">Termos de Uso</a></p>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>