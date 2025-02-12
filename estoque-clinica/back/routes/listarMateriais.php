<?php
require_once '../db.php';

try {
    $conn = getConnection();
    $descricao = $_GET['descricao'] ?? '';
    $tipo_material = $_GET['tipo_material'] ?? '';
    $segmento = $_GET['segmento'] ?? '';

    $sql = "SELECT * FROM estoque WHERE 1=1";
    $params = [];

    if ($descricao) {
        $sql .= " AND descricao LIKE ?";
        $params[] = "%$descricao%";
    }
    if ($tipo_material && $tipo_material !== 'Todos') {
        $sql .= " AND tipo_material = ?";
        $params[] = $tipo_material;
    }
    if ($segmento && $segmento !== 'Todos') {
        $sql .= " AND segmento = ?";
        $params[] = $segmento;
    }

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($result);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao listar materiais: ' . $e->getMessage()]);
}
