<?php
session_start();
require_once __DIR__ . '/../db.php';


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

class PainelEstoqueController {
    public function listarNotificacoesNaoVisualizadas() {
        try {
            $conn = getConnection();
            $stmt = $conn->prepare("SELECT * FROM notificacoes_estoque WHERE visualizado = FALSE ORDER BY data_notificacao DESC");
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            throw new Exception("Erro ao listar notificações: " . $e->getMessage());
        }
    }
}

// Rota para listar notificações
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'listarNotificacoes') {
    try {
        $painelEstoqueController = new PainelEstoqueController();
        $notificacoes = $painelEstoqueController->listarNotificacoesNaoVisualizadas();

        header('Content-Type: application/json');
        echo json_encode($notificacoes);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao buscar notificações: ' . $e->getMessage()]);
    }
    exit;
}
