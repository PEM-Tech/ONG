<?php
session_start();
require_once '../db.php';

class ListaUsuarios {
    // Função para listar todos os usuários
    public function listarUsuarios() {
        $conn = getConnection();
        if ($conn) {
            try {
                $sql = "SELECT u.id_usuario, u.nome, u.sobrenome, u.email, u.funcao_id, f.nome AS funcao_nome 
                        FROM usuarios u 
                        LEFT JOIN funcoes f ON u.funcao_id = f.id";
                $stmt = $conn->prepare($sql);
                $stmt->execute();
    
                $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
                return $usuarios;
            } catch (PDOException $e) {
                echo "Erro ao listar usuários: " . $e->getMessage();
            }
        } else {
            echo "Erro ao conectar ao banco de dados.";
        }
    }
    
}

class EditarUsuario {
    // Função para editar um usuário
    public function editarUsuario($id, $nome, $sobrenome, $funcao_id, $email) {
        $conn = getConnection();
        if ($conn) {
            try {
                $sql = "UPDATE usuarios SET nome = :nome, sobrenome = :sobrenome, funcao_id = :funcao_id, email = :email WHERE id_usuario = :id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':id', $id, PDO::PARAM_INT);
                $stmt->bindParam(':nome', $nome, PDO::PARAM_STR);
                $stmt->bindParam(':sobrenome', $sobrenome, PDO::PARAM_STR);
                $stmt->bindParam(':funcao_id', $funcao_id, PDO::PARAM_INT);
                $stmt->bindParam(':email', $email, PDO::PARAM_STR);
                $stmt->execute();

                echo 'Usuário atualizado com sucesso';
            } catch (PDOException $e) {
                echo "Erro ao editar usuário: " . $e->getMessage();
            }
        } else {
            echo "Erro ao conectar ao banco de dados.";
        }
    }
}

class ExcluirUsuario {
    // Função para excluir um usuário
    public function excluirUsuario($id) {
        $conn = getConnection();
        if ($conn) {
            try {
                $sql = "DELETE FROM usuarios WHERE id_usuario = :id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':id', $id, PDO::PARAM_INT);
                $stmt->execute();

                echo 'Usuário excluído com sucesso';
            } catch (PDOException $e) {
                echo "Erro ao excluir usuário: " . $e->getMessage();
            }
        } else {
            echo "Erro ao conectar ao banco de dados.";
        }
    }
}

class ListaFuncoes {
    // Função para listar todas as funções disponíveis
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
}

// Verificar qual ação deve ser executada
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['action']) && $_GET['action'] == 'listar') {
        $listaUsuarios = new ListaUsuarios();
        $usuarios = $listaUsuarios->listarUsuarios();
        echo json_encode($usuarios);
    } elseif (isset($_GET['action']) && $_GET['action'] == 'listar_funcoes') {
        $listaFuncoes = new ListaFuncoes();
        $funcoes = $listaFuncoes->listarFuncoes();
        echo json_encode($funcoes);
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['edit'])) {
        $editarUsuario = new EditarUsuario();
        $id = $_POST['id'];
        $nome = $_POST['nome'];
        $sobrenome = $_POST['sobrenome'];
        $funcao_id = $_POST['funcao_id']; // Agora utilizamos o funcao_id
        $email = $_POST['email'];

        $editarUsuario->editarUsuario($id, $nome, $sobrenome, $funcao_id, $email);
    } elseif (isset($_POST['delete'])) {
        $excluirUsuario = new ExcluirUsuario();
        $id = $_POST['id'];

        $excluirUsuario->excluirUsuario($id);
    }
}
?>
