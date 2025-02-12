<?php
require_once '../db.php';

header('Content-Type: application/json');
if (isset($_GET['action']) && $_GET['action'] === 'graficoEstoqueMinimo') {
    try {
        $conn = getConnection();
        $query = "SELECT 
                    tipo_material, 
                    SUM(quantidade) AS estoque_atual, 
                    MAX(estoque_minimo) AS estoque_minimo 
                  FROM estoque 
                  GROUP BY tipo_material";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        echo json_encode($result);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
