<?php
session_start();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Perfil do Usuário</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Roboto', sans-serif;
            background-color: #f0f2f5;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            background-color: #ffffff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            width: 90%;
            max-width: 500px;
            padding: 20px;
            text-align: center;
        }
        .profile-pic {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background-color: #ddd;
            display: inline-block;
            margin-bottom: 20px;
        }
        .user-info {
            margin-bottom: 15px;
        }
        .user-info input {
            width: 100%;
            padding: 10px;
            margin: 5px 0;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #f9f9f9; /* Para indicar que o campo não é editável */
        }
        .user-info input[readonly] {
            color: #6c757d; /* Deixa o texto um pouco mais acinzentado */
        }
        @media (max-width: 600px) {
            .container {
                width: 100%;
                margin: 10px;
            }
        }
        .save-btn {
            background-color: #007bff;
            color: #fff;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: not-allowed; /* Indica que o botão está desativado */
        }
    </style>
</head>
<body>
<?php include 'navbar.php'; ?> <!-- Aqui você inclui o menu lateral -->
    <div class="container">
        <div class="profile-pic" id="profile-pic"></div>
        <div class="user-info">
            <input type="text" id="user-name" placeholder="Nome" value="<?php echo isset($_SESSION['usuario_nome']) ? $_SESSION['usuario_nome'] : ''; ?>" readonly>
            <input type="text" id="user-sobrenome" placeholder="Sobrenome" value="<?php echo isset($_SESSION['usuario_sobrenome']) ? $_SESSION['usuario_sobrenome'] : ''; ?>" readonly>
            <input type="email" id="user-email" placeholder="Email" value="<?php echo isset($_SESSION['usuario_email']) ? $_SESSION['usuario_email'] : ''; ?>" readonly>
            <input type="password" id="user-password" placeholder="Senha" value="<?php echo isset($_SESSION['usuario_senha']) ? $_SESSION['usuario_senha'] : ''; ?>" readonly>
            <input type="text" id="user-funcao" placeholder="Função" value="<?php echo isset($_SESSION['usuario_funcao_nome']) ? $_SESSION['usuario_funcao_nome'] : ''; ?>" readonly>
        </div>

    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Utilizando dados do PHP via sessão para a imagem de perfil
            const userProfilePicUrl = "<?php echo isset($_SESSION['usuario_profile_pic']) ? $_SESSION['usuario_profile_pic'] : ''; ?>";
            
            // Definir a imagem de perfil, se existir na sessão
            if (userProfilePicUrl) {
                const profilePic = document.getElementById('profile-pic');
                profilePic.style.backgroundImage = `url(${userProfilePicUrl})`;
                profilePic.style.backgroundSize = 'cover';
                profilePic.style.backgroundPosition = 'center';
            }
        });

        function salvarDados() {
            // Como os campos estão readonly, o botão de salvar não faz nada.
            console.warn('Os campos não são editáveis.');
        }
    </script>
</body>
</html>
