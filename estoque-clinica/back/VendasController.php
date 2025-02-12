<?php
require_once 'db.php';

class VendasController {
    private $conn;

    public function __construct() {
        $this->conn = getConnection();
    }

    public function getVendasComFiltros($params) {
        $query = "";
        $binds = [];

        // Seleção da query com base no tipo de relatório
        if ($params['relatorio'] === 'mensal') {
            $query = "
                SELECT MONTH(data_venda) AS label, SUM(total_venda) AS total_vendas
                FROM notas
                WHERE YEAR(data_venda) = :ano
                GROUP BY MONTH(data_venda)
            ";
            $binds[':ano'] = $params['ano'];
        } elseif ($params['relatorio'] === 'anual') {
            $query = "
                SELECT YEAR(data_venda) AS label, SUM(total_venda) AS total_vendas
                FROM notas
                GROUP BY YEAR(data_venda)
            ";
        } elseif ($params['relatorio'] === 'usuario') {
            $query = "
                SELECT u.nome AS label, SUM(n.total_venda) AS total_vendas
                FROM notas n
                JOIN usuarios u ON n.usuario_id = u.id_usuario
                GROUP BY u.id_usuario
            ";
        }

        // Outros filtros comuns a todos os relatórios
        if (!empty($params['data_inicial']) && !empty($params['data_final'])) {
            $query .= " AND data_venda BETWEEN :data_inicial AND :data_final";
            $binds[':data_inicial'] = $params['data_inicial'];
            $binds[':data_final'] = $params['data_final'];
        }

        // Executa a query
        try {
            $stmt = $this->conn->prepare($query);
            foreach ($binds as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            echo "Erro ao buscar dados: " . $e->getMessage();
            return [];
        }
    }
}

// Manipulador para requisições AJAX
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $params = [
        'relatorio' => $_GET['relatorio'] ?? 'mensal',
        'mes' => $_GET['mes'] ?? null,
        'ano' => $_GET['ano'] ?? date('Y'),
        'data_inicial' => $_GET['data_inicial'] ?? null,
        'data_final' => $_GET['data_final'] ?? null,
    ];

    $controller = new VendasController();
    $vendas = $controller->getVendasComFiltros($params);

    header('Content-Type: application/json');
    echo json_encode($vendas);
}
?>
