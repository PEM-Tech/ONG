<?php
require_once '../db.php'; // Verifique o caminho do arquivo de conexão

header('Content-Type: application/json');

try {
    $conn = getConnection();
    $stmt = $conn->query("SELECT DISTINCT tipo_material FROM estoque");
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
} catch (Exception $e) {
    error_log("Erro no getTiposMaterial.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
