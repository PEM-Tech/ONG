<?php
session_start();
require_once 'db.php';

class Usuario {

    // Função para cadastrar um usuário
    public function cadastrarUsuario($firstname, $lastname, $funcao_id, $email, $password) {
        $conn = getConnection();
        if ($conn) {
            try {
                // Verificar se o email já está cadastrado
                $sqlCheck = "SELECT * FROM usuarios WHERE email = :email";
                $stmtCheck = $conn->prepare($sqlCheck);
                $stmtCheck->bindParam(':email', $email);
                $stmtCheck->execute();

                if ($stmtCheck->rowCount() > 0) {
                    header('Location: ../front/cadastra.php?error=email_exists');
                    exit();
                }

                // Inserir dados do usuário
                $sql = "INSERT INTO usuarios (nome, sobrenome, funcao_id, email, password) VALUES (:firstname, :lastname, :funcao_id, :email, :password)";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':firstname', $firstname);
                $stmt->bindParam(':lastname', $lastname);
                $stmt->bindParam(':funcao_id', $funcao_id, PDO::PARAM_INT);
                $stmt->bindParam(':email', $email);
                $stmt->bindParam(':password', $password);
                $stmt->execute();

                header('Location: ../front/usuarioedit.php');
                exit();
            } catch (PDOException $e) {
                echo "Erro ao inserir dados: " . $e->getMessage();
            }
        } else {
            echo "Erro ao conectar ao banco de dados.";
        }
    }

    // Função para listar todas as funções disponíveis para o select
    public function listarFuncoes() {
        $conn = getConnection();
        if ($conn) {
            try {
                $sql = "SELECT id, nome FROM funcoes";
                $stmt = $conn->prepare($sql);
                $stmt->execute();

                $funcoes = $stmt->fetchAll(PDO::FETCH_ASSOC);
                return $funcoes;
            } catch (PDOException $e) {
                echo "Erro ao listar funções: " . $e->getMessage();
            }
        } else {
            echo "Erro ao conectar ao banco de dados.";
        }
    }

    // Função para validar o login
    public function validarLogin($email, $password) {
        $sql = "SELECT u.*, f.nome AS funcao_nome FROM usuarios u INNER JOIN funcoes f ON u.funcao_id = f.id WHERE u.email = :email";
        $conn = getConnection();
        if ($conn) {
            try {
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':email', $email);
                $stmt->execute();

                $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($usuario && password_verify($password, $usuario['password'])) {
                    // Armazena os detalhes do usuário na sessão
                    $_SESSION['usuario_id'] = $usuario['id_usuario'];
                    $_SESSION['usuario_nome'] = $usuario['nome'];
                    $_SESSION['usuario_sobrenome'] = $usuario['sobrenome'];
                    $_SESSION['usuario_senha'] = $usuario['password'];
                    $_SESSION['usuario_email'] = $usuario['email'];
                    $_SESSION['usuario_funcao_id'] = $usuario['funcao_id']; 
                    $_SESSION['usuario_funcao'] = $usuario['funcao_id'];// Armazena o ID da função
                    $_SESSION['usuario_funcao_nome'] = $usuario['funcao_nome']; // Armazena o nome da função

                    // Definir URL da home com base na função do usuário
                    switch ($usuario['funcao_id']) {
                        case 1: // Venda
                            $_SESSION['homeUrl'] = '../front/home_vendas.php';
                            header('Location: ../front/home_vendas.php');
                            break;
                        case 2: // Administrador
                            $_SESSION['homeUrl'] = '../front/homeadmEV.php';
                            header('Location: ../front/homeadmEV.php');
                            break;
                        case 3: // Estoque
                            $_SESSION['homeUrl'] = '../front/home.php';
                            header('Location: ../front/home.php');
                            break;
                        case 4: // Supervisor (exemplo)
                            $_SESSION['homeUrl'] = '../front/home_supervisor.php';
                            header('Location: ../front/home_supervisor.php');
                            break;
                        default:
                            header('Location: ../index.php?error=no_funcao');
                            break;
                    }
                    exit();
                } else {
                    header('Location: ../index.php?error=invalid_credentials');
                    exit();
                }
            } catch (PDOException $e) {
                echo "Erro ao validar login: " . $e->getMessage();
            }
        } else {
            echo "Erro ao conectar ao banco de dados.";
        }
    }

    // Função para deslogar o usuário
    public function logout() {
        session_unset();
        session_destroy();
        header('Location: ../index.php');
        exit();
    }
}

// Verificar se o formulário foi enviado para cadastro, login ou logout
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $usuario = new Usuario();

    if (isset($_POST['register'])) {
        $firstname = $_POST['sr_firstname'];
        $lastname = $_POST['sr_lastname'];
        $funcao_id = $_POST['sr_funcao']; // Deve ser o ID da função selecionada
        $email = $_POST['email'];
        $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

        $usuario->cadastrarUsuario($firstname, $lastname, $funcao_id, $email, $password);
    } elseif (isset($_POST['login'])) {
        $email = $_POST['email'];
        $password = $_POST['password'];

        $usuario->validarLogin($email, $password);
    }
}

// Verificar se o logout foi requisitado
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    $usuario = new Usuario();
    $usuario->logout();
}

// Se o método for GET e a ação for listar funções
if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['action']) && $_GET['action'] == 'listar_funcoes') {
    $usuario = new Usuario();
    $funcoes = $usuario->listarFuncoes();
    echo json_encode($funcoes);
}
