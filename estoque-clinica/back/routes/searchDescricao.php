<?php
require_once '../db.php'; // Caminho para o arquivo de conexão

header('Content-Type: application/json');

if (isset($_GET['descricao'])) {
    try {
        $descricao = $_GET['descricao'];
        $conn = getConnection();
        $stmt = $conn->prepare("SELECT descricao FROM estoque WHERE descricao LIKE :descricao LIMIT 10");
        $stmt->bindValue(':descricao', '%' . $descricao . '%');
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($result);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Parâmetro descricao não fornecido']);
}
