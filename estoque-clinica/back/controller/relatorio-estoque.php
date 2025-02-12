<?php
require_once __DIR__ . '/../db.php';

function getDadosEstoque() {
    try {
        $conn = getConnection();
        $sql = "SELECT descricao, quantidade, estoque_minimo, estoque_seguranca, validade, preco, deposito FROM estoque";
        $stmt = $conn->query($sql);
        $dados = $stmt->fetchAll(PDO::FETCH_ASSOC);
        header('Content-Type: application/json');
        echo json_encode($dados);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    getDadosEstoque();
}