<?php
require_once 'db.php';
require_once 'relatoriocontroller.php';

// Definindo cabeçalhos para permitir requisições CORS e resposta em JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Inicializa a classe Relatorio
try {
    $relatorio = new Relatorio();
} catch (Exception $e) {
    echo json_encode(['error' => 'Erro ao conectar com o banco de dados']);
    exit();
}

// Verifica qual ação foi solicitada via parâmetro GET
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'notasPorMes':
        // Busca e envia notas agrupadas por mês
        $data = $relatorio->getNotasPorMes();
        echo json_encode(formatDataForChart($data, 'mes', 'total', 'Mês'));
        break;

    case 'notasPorAno':
        // Busca e envia notas agrupadas por ano
        $data = $relatorio->getNotasPorAno();
        echo json_encode(formatDataForChart($data, 'ano', 'total', 'Ano'));
        break;

    case 'notasPorUsuario':
        // Busca e envia notas agrupadas por usuário
        $data = $relatorio->getNotasPorUsuarios();
        echo json_encode(formatDataForChart($data, 'usuario_id', 'total', 'Usuário'));
        break;

    default:
        // Resposta padrão para ações inválidas
        echo json_encode(['error' => 'Ação inválida']);
        break;
}

/**
 * Função para formatar dados para o gráfico no formato esperado pelo Chart.js
 *
 * @param array $data Dados retornados do banco de dados
 * @param string $labelKey Nome da coluna que será usada como rótulo
 * @param string $dataKey Nome da coluna que será usada como valor
 * @param string $labelPrefix Prefixo para o rótulo (ex.: "Mês", "Ano")
 * @return array Dados formatados para o Chart.js
 */
function formatDataForChart($data, $labelKey, $dataKey, $labelPrefix) {
    $formattedData = [
        'labels' => [],
        'values' => []
    ];

    foreach ($data as $row) {
        $formattedData['labels'][] = $labelPrefix . ' ' . $row[$labelKey];
        $formattedData['values'][] = $row[$dataKey];
    }

    return $formattedData;
}
