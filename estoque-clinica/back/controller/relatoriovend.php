<?php
session_start();
require_once '../db.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

class RelatorioVendedor {
    private $conn;

    public function __construct() {
        $this->conn = getConnection();
    }

    // Listar os vendedores para o dropdown
    public function listarVendedores() {
        try {
            $sql = "SELECT u.id_usuario, u.nome 
                    FROM usuarios u 
                    INNER JOIN funcoes f ON u.funcao_id = f.id 
                    WHERE f.nome = 'Venda'";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
            $vendedores = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($vendedores);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    // Obter anos e meses para os últimos 5 anos
    public function obterAnosMesesVendas() {
        $anos = [];
        $meses = [
            ['valor' => 1, 'nome' => 'Janeiro'],
            ['valor' => 2, 'nome' => 'Fevereiro'],
            ['valor' => 3, 'nome' => 'Março'],
            ['valor' => 4, 'nome' => 'Abril'],
            ['valor' => 5, 'nome' => 'Maio'],
            ['valor' => 6, 'nome' => 'Junho'],
            ['valor' => 7, 'nome' => 'Julho'],
            ['valor' => 8, 'nome' => 'Agosto'],
            ['valor' => 9, 'nome' => 'Setembro'],
            ['valor' => 10, 'nome' => 'Outubro'],
            ['valor' => 11, 'nome' => 'Novembro'],
            ['valor' => 12, 'nome' => 'Dezembro']
        ];

        $anoAtual = date('Y');
        for ($i = 0; $i < 5; $i++) {
            $anos[] = $anoAtual - $i;
        }

        echo json_encode(['anos' => $anos, 'meses' => $meses]);
    }

    // Obter o relatório de vendas para um vendedor específico em um ano e mês selecionados
    public function obterRelatorioVendas($usuarioId, $ano, $mes) {
        if (!$usuarioId || !$ano || !$mes) {
            echo json_encode(['error' => 'Parâmetros insuficientes fornecidos']);
            return;
        }

        try {
            $sql = "SELECT data_venda, total_venda 
                    FROM notas 
                    WHERE usuario_id = :usuarioId 
                    AND YEAR(data_venda) = :ano 
                    AND MONTH(data_venda) = :mes
                    ORDER BY data_venda";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':usuarioId', $usuarioId, PDO::PARAM_INT);
            $stmt->bindParam(':ano', $ano, PDO::PARAM_INT);
            $stmt->bindParam(':mes', $mes, PDO::PARAM_INT);
            $stmt->execute();
            $vendas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($vendas);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}

// Verificar qual ação deve ser executada
if (isset($_GET['action'])) {
    $relatorioVendedor = new RelatorioVendedor();

    switch ($_GET['action']) {
        case 'listarVendedores':
            $relatorioVendedor->listarVendedores();
            break;

        case 'obterAnosMesesVendas':
            $relatorioVendedor->obterAnosMesesVendas();
            break;

        case 'obterRelatorioVendas':
            $usuarioId = isset($_GET['vendedorId']) ? intval($_GET['vendedorId']) : null;
            $ano = isset($_GET['ano']) ? intval($_GET['ano']) : null;
            $mes = isset($_GET['mes']) ? intval($_GET['mes']) : null;
            $relatorioVendedor->obterRelatorioVendas($usuarioId, $ano, $mes);
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Ação inválida']);
            break;
    }
}
?>
