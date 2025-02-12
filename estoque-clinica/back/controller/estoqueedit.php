<?php
session_start();
require_once '../db.php';
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

class EstoqueEdit {

    private $tableMap = [
        'unidade_medida' => 'unidade_medida',
        'deposito' => 'deposito',
        'segmento' => 'segmento',
        'tipo_material' => 'tipo_material'
    ];

    private function getMappedTable($categoria) {
        if (!array_key_exists($categoria, $this->tableMap)) {
            throw new Exception("Categoria inválida: $categoria");
        }
        return $this->tableMap[$categoria];
    }

    private function getConnection() {
        $conn = getConnection();
        if (!$conn) {
            throw new Exception("Erro ao conectar ao banco de dados.");
        }
        return $conn;
    }

    public function listarCategorias($categoria) {
        try {
            $conn = $this->getConnection();
            $tabela = $this->getMappedTable($categoria);

            $sql = "SELECT id, descricao FROM $tabela";
            $stmt = $conn->prepare($sql);
            $stmt->execute();

            $categorias = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $this->sendSuccessResponse(["data" => $categorias]);
        } catch (PDOException $e) {
            $this->sendErrorResponse("Erro ao listar categorias de $categoria: " . $e->getMessage(), 500);
        } catch (Exception $e) {
            $this->sendErrorResponse($e->getMessage(), 500);
        }
    }

    public function editarItem($id, $descricaoNova, $categoria) {
        try {
            $conn = $this->getConnection();
            $tabela = $this->getMappedTable($categoria);

            $sql = "UPDATE $tabela SET descricao = :descricaoNova WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':descricaoNova', $descricaoNova);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            $this->sendSuccessResponse(["message" => "Item atualizado com sucesso"]);
        } catch (PDOException $e) {
            $this->sendErrorResponse("Erro ao editar item em $categoria: " . $e->getMessage(), 500);
        } catch (Exception $e) {
            $this->sendErrorResponse($e->getMessage(), 500);
        }
    }

    public function excluirItem($id, $categoria) {
        try {
            $conn = $this->getConnection();
            $tabela = $this->getMappedTable($categoria);

            $sql = "DELETE FROM $tabela WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            $this->sendSuccessResponse(["message" => "Item excluído com sucesso"]);
        } catch (PDOException $e) {
            $this->sendErrorResponse("Erro ao excluir item em $categoria: " . $e->getMessage(), 500);
        } catch (Exception $e) {
            $this->sendErrorResponse($e->getMessage(), 500);
        }
    }

    public function adicionarCategoria($categoria, $descricao) {
        try {
            $conn = $this->getConnection();
            $tabela = $this->getMappedTable($categoria);

            $sql = "INSERT INTO $tabela (descricao) VALUES (:descricao)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':descricao', $descricao);
            $stmt->execute();

            $this->sendSuccessResponse(["message" => "Categoria adicionada com sucesso"]);
        } catch (PDOException $e) {
            $this->sendErrorResponse("Erro ao adicionar categoria em $categoria: " . $e->getMessage(), 500);
        } catch (Exception $e) {
            $this->sendErrorResponse($e->getMessage(), 500);
        }
    }

    private function sendSuccessResponse($data) {
        header('Content-Type: application/json');
        echo json_encode(array_merge(["status" => "success"], $data));
        exit();
    }

    private function sendErrorResponse($message, $httpCode = 500) {
        http_response_code($httpCode);
        header('Content-Type: application/json');
        echo json_encode(["status" => "error", "message" => $message]);
        error_log($message);
        exit();
    }
}

// Verificar qual ação deve ser executada
$estoqueEdit = new EstoqueEdit();

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['action']) && $_GET['action'] == 'listar' && isset($_GET['categoria'])) {
        $categoria = $_GET['categoria'];
        $estoqueEdit->listarCategorias($categoria);
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['edit']) && isset($_POST['id']) && isset($_POST['descricaoNova']) && isset($_POST['categoria'])) {
        $id = $_POST['id'];
        $descricaoNova = $_POST['descricaoNova'];
        $categoria = $_POST['categoria'];
        $estoqueEdit->editarItem($id, $descricaoNova, $categoria);
    }

    if (isset($_POST['delete']) && isset($_POST['id']) && isset($_POST['categoria'])) {
        $id = $_POST['id'];
        $categoria = $_POST['categoria'];
        $estoqueEdit->excluirItem($id, $categoria);
    }

    if (isset($_POST['add']) && isset($_POST['descricao']) && isset($_POST['categoria'])) {
        $descricao = $_POST['descricao'];
        $categoria = $_POST['categoria'];
        $estoqueEdit->adicionarCategoria($categoria, $descricao);
    }
}
