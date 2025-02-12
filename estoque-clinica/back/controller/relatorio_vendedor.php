<?php
session_start();
require_once __DIR__ . '/../db.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

class RelatorioVendedorController {
    public function buscarVendasPorPeriodo($usuarioId, $tipoRelatorio, $ano = null, $mes = null) {
        $conn = getConnection();
        $resultado = [];

        try {
            if ($tipoRelatorio === 'semanal') {
                // Total da semana atual
                $stmtSemana = $conn->prepare("SELECT SUM(total_venda) AS total_semana
                                              FROM notas
                                              WHERE usuario_id = ? AND YEARWEEK(data_venda, 1) = YEARWEEK(CURDATE(), 1)");
                $stmtSemana->execute([$usuarioId]);
                $resultado['total_semana'] = $stmtSemana->fetch(PDO::FETCH_ASSOC)['total_semana'] ?? 0;

                // Vendas diárias da semana atual
                $stmtVendasDiarias = $conn->prepare("SELECT DAYOFWEEK(data_venda) AS dia_semana, SUM(total_venda) AS total_dia
                                                     FROM notas
                                                     WHERE usuario_id = ? AND YEARWEEK(data_venda, 1) = YEARWEEK(CURDATE(), 1)
                                                     GROUP BY dia_semana");
                $stmtVendasDiarias->execute([$usuarioId]);
                $vendasDiarias = $stmtVendasDiarias->fetchAll(PDO::FETCH_ASSOC);

                // Preencher vendas diárias no array de 7 dias, com valor padrão 0
                $vendasPorDia = array_fill(0, 7, 0);
                foreach ($vendasDiarias as $venda) {
                    $diaSemanaIndex = ($venda['dia_semana'] + 5) % 7; // Ajustando o índice para começar de segunda-feira
                    $vendasPorDia[$diaSemanaIndex] = $venda['total_dia'];
                }
                $resultado['vendas_diarias'] = $vendasPorDia;

            } elseif ($tipoRelatorio === 'mensal') {
                // Total do mês selecionado ou atual
                $ano = $ano ?? date('Y');
                $mes = $mes ?? date('m');
                $stmtMes = $conn->prepare("SELECT SUM(total_venda) AS total_mes
                                           FROM notas
                                           WHERE usuario_id = ? AND MONTH(data_venda) = ? AND YEAR(data_venda) = ?");
                $stmtMes->execute([$usuarioId, $mes, $ano]);
                $resultado['total_mes'] = $stmtMes->fetch(PDO::FETCH_ASSOC)['total_mes'] ?? 0;

                // Vendas por semana no mês selecionado ou atual
                $stmtVendasSemanais = $conn->prepare("SELECT WEEK(data_venda, 1) AS semana, SUM(total_venda) AS total_semana
                                                      FROM notas
                                                      WHERE usuario_id = ? AND MONTH(data_venda) = ? AND YEAR(data_venda) = ?
                                                      GROUP BY semana");
                $stmtVendasSemanais->execute([$usuarioId, $mes, $ano]);
                $vendasSemanais = $stmtVendasSemanais->fetchAll(PDO::FETCH_ASSOC);

                // Preencher vendas semanais no array de 6 semanas, com valor padrão 0
                $vendasPorSemana = array_fill(0, 6, 0);
                foreach ($vendasSemanais as $venda) {
                    $semanaIndex = $venda['semana'] - min(array_column($vendasSemanais, 'semana')); // Ajustar o índice
                    $vendasPorSemana[$semanaIndex] = $venda['total_semana'];
                }
                $resultado['vendas_semanais'] = $vendasPorSemana;

            } elseif ($tipoRelatorio === 'anual') {
                // Total do ano selecionado ou atual
                $ano = $ano ?? date('Y');
                $stmtAno = $conn->prepare("SELECT SUM(total_venda) AS total_ano
                                           FROM notas
                                           WHERE usuario_id = ? AND YEAR(data_venda) = ?");
                $stmtAno->execute([$usuarioId, $ano]);
                $resultado['total_ano'] = $stmtAno->fetch(PDO::FETCH_ASSOC)['total_ano'] ?? 0;

                // Vendas mensais do ano selecionado ou atual
                $stmtVendasMensais = $conn->prepare("SELECT MONTH(data_venda) AS mes, SUM(total_venda) AS total_mes
                                                     FROM notas
                                                     WHERE usuario_id = ? AND YEAR(data_venda) = ?
                                                     GROUP BY mes");
                $stmtVendasMensais->execute([$usuarioId, $ano]);
                $vendasMensais = $stmtVendasMensais->fetchAll(PDO::FETCH_ASSOC);

                // Preencher vendas mensais no array de 12 meses, com valor padrão 0
                $vendasPorMes = array_fill(0, 12, 0);
                foreach ($vendasMensais as $venda) {
                    $mesIndex = $venda['mes'] - 1; // Ajustar para índice começar de 0
                    $vendasPorMes[$mesIndex] = $venda['total_mes'];
                }
                $resultado['vendas_mensais'] = $vendasPorMes;
            }

            return $resultado;
        } catch (Exception $e) {
            throw new Exception("Erro ao buscar as vendas: " . $e->getMessage());
        }
    }
    
}

// Rota para buscar vendas do vendedor logado
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'resumoVendas') {
    try {
        if (!isset($_SESSION['usuarioId'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Usuário não autenticado']);
            exit;
        }

        $usuarioId = $_SESSION['usuarioId'];
        $tipoRelatorio = $_GET['tipo'] ?? 'semanal';
        $ano = $_GET['ano'] ?? null;
        $mes = $_GET['mes'] ?? null;

        $relatorioController = new RelatorioVendedorController();
        $resumoVendas = $relatorioController->buscarVendasPorPeriodo($usuarioId, $tipoRelatorio, $ano, $mes);

        header('Content-Type: application/json');
        echo json_encode($resumoVendas);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao buscar o resumo das vendas: ' . $e->getMessage()]);
    }
    exit;
}
?>
