<?php
require_once '../db.php';

header('Content-Type: application/json'); // Garantir o retorno como JSON puro

if (isset($_GET['action']) && $_GET['action'] === 'dadosgraficos') {
    try {
        $conn = getConnection();
        $query = "SELECT tipo_material, SUM(quantidade) as total FROM estoque GROUP BY tipo_material";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($result); // Apenas o JSON, sem caracteres extras
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Ação inválida']);
}