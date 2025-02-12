<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

// Conectar ao banco de dados
require_once __DIR__ . '/../db.php';

switch ($action) {
    case 'listar':
        try {
            $conn = getConnection();

            // Consultar todas as páginas
            $stmtPaginas = $conn->query("SELECT id, nome FROM paginas");
            $paginas = $stmtPaginas->fetchAll(PDO::FETCH_ASSOC);

            // Consultar todas as funções
            $stmtFuncoes = $conn->query("SELECT id, nome FROM funcoes");
            $funcoes = $stmtFuncoes->fetchAll(PDO::FETCH_ASSOC);

            // Consultar todas as permissões
            $stmtPermissoes = $conn->query("SELECT pagina_id, funcao_id FROM permissoes_paginas");
            $permissoes = $stmtPermissoes->fetchAll(PDO::FETCH_ASSOC);

            // Estruturar as permissões em um formato associativo
            $permissoesPorPagina = [];
            foreach ($paginas as $pagina) {
                $permissoesPorPagina[$pagina['id']] = [
                    'nome' => $pagina['nome'],
                    'funcoes' => []
                ];
            }

            foreach ($permissoes as $permissao) {
                $permissoesPorPagina[$permissao['pagina_id']]['funcoes'][] = $permissao['funcao_id'];
            }

            echo json_encode([
                'paginas' => $permissoesPorPagina,
                'funcoes' => $funcoes
            ]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'error' => 'Erro ao listar permissões: ' . $e->getMessage()]);
        }
        break;

    case 'salvar':
        $input = json_decode(file_get_contents('php://input'), true);
        if (isset($input['permissoes'])) {
            try {
                $conn = getConnection();
                $conn->beginTransaction();

                // Inserir novas permissões
                $stmtInserir = $conn->prepare("INSERT INTO permissoes_paginas (pagina_id, funcao_id) VALUES (:pagina_id, :funcao_id)");

                foreach ($input['permissoes'] as $paginaId => $funcoes) {
                    foreach ($funcoes as $funcaoId) {
                        $stmtInserir->execute([
                            ':pagina_id' => $paginaId,
                            ':funcao_id' => $funcaoId
                        ]);
                    }
                }

                $conn->commit();
                echo json_encode(['success' => true]);
            } catch (PDOException $e) {
                $conn->rollBack();
                echo json_encode(['success' => false, 'error' => 'Erro ao salvar permissões: ' . $e->getMessage()]);
            }
        } else {
            echo json_encode(['success' => false, 'error' => 'Dados inválidos']);
        }
        break;

    default:
        echo json_encode(['success' => false, 'error' => 'Ação inválida']);
        break;
}
?>
