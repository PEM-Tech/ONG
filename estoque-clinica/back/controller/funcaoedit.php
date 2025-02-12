<?php
require_once __DIR__ . '/../db.php';

class FuncoesController {

    // Função para listar todas as funções
    public function listarFuncoes() {
        header('Content-Type: application/json');

        try {
            $conn = getConnection();
            $sql = "SELECT * FROM funcoes";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $funcoes = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($funcoes);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    // Função para criar nova função
    public function criarFuncao($nome, $descricao = '') {
        header('Content-Type: application/json');

        try {
            $conn = getConnection();
            $sql = "INSERT INTO funcoes (nome, descricao) VALUES (:nome, :descricao)";
            $stmt = $conn->prepare($sql);

            $stmt->bindParam(':nome', $nome);
            $stmt->bindParam(':descricao', $descricao);

            $stmt->execute();

            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    // Função para buscar uma função por ID
    public function buscarFuncaoPorId($id) {
        header('Content-Type: application/json');

        try {
            $conn = getConnection();
            $sql = "SELECT * FROM funcoes WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $funcao = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($funcao) {
                echo json_encode($funcao);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Função não encontrada.']);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    // Função para editar uma função existente
    public function editarFuncao($id, $nome, $descricao = '') {
        header('Content-Type: application/json');

        try {
            $conn = getConnection();
            $sql = "UPDATE funcoes SET nome = :nome, descricao = :descricao WHERE id = :id";
            $stmt = $conn->prepare($sql);

            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':nome', $nome);
            $stmt->bindParam(':descricao', $descricao);

            $stmt->execute();

            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    // Função para excluir uma função
    public function excluirFuncao($id) {
        header('Content-Type: application/json');

        try {
            $conn = getConnection();
            $sql = "DELETE FROM funcoes WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}

// Identificar qual ação o usuário está requisitando
if (isset($_GET['action'])) {
    $controller = new FuncoesController();
    $action = $_GET['action'];

    switch ($action) {
        case 'listar':
            $controller->listarFuncoes();
            break;

        case 'criar':
            $data = json_decode(file_get_contents('php://input'), true);
            $nome = $data['nome'] ?? '';
            $descricao = $data['descricao'] ?? '';
            $controller->criarFuncao($nome, $descricao);
            break;

        case 'buscar':
            $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            $controller->buscarFuncaoPorId($id);
            break;

        case 'editar':
            $data = json_decode(file_get_contents('php://input'), true);
            $id = $data['id'] ?? 0;
            $nome = $data['nome'] ?? '';
            $descricao = $data['descricao'] ?? '';
            $controller->editarFuncao($id, $nome, $descricao);
            break;

        case 'excluir':
            $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            $controller->excluirFuncao($id);
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Ação inválida']);
            break;
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Nenhuma ação especificada']);
}
?>
