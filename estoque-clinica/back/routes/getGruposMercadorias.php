<?php
require_once '../db.php'; // Ajuste para o caminho do seu arquivo de conexão com o banco

header('Content-Type: application/json');

try {
    $conn = getConnection();
    $stmt = $conn->query("SELECT DISTINCT segmento FROM estoque");
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
