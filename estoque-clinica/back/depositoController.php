<?php

require_once 'db.php';





class EstoqueController {

 // Listar Tipos de Material
 public function listarTiposMaterial() {
    try {
        $conn = getConnection();
        $sql = "SELECT DISTINCT tipo_material FROM estoque ORDER BY tipo_material ASC";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Retorna JSON válido
        header('Content-Type: application/json');
        echo json_encode($result);
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao listar tipos de material: ' . $e->getMessage()]);
        exit;
    }
}


// Listar Segmentos
public function listarSegmentos() {
    try {
        $conn = getConnection();
        $sql = "SELECT DISTINCT segmento FROM estoque ORDER BY segmento ASC";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Retorna JSON válido
        header('Content-Type: application/json');
        echo json_encode($result);
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao listar segmentos: ' . $e->getMessage()]);
        exit;
    }
}

// Listar Materiais
public function listarMateriais($pagina = 1, $itensPorPagina = 10) {
    try {
        $conn = getConnection();
        $offset = ($pagina - 1) * $itensPorPagina;

        $sql = "SELECT * FROM estoque LIMIT :limit OFFSET :offset";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':limit', $itensPorPagina, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $materiais = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Total de itens para cálculo de páginas
        $totalItens = $conn->query("SELECT COUNT(*) FROM estoque")->fetchColumn();
        $totalPaginas = ceil($totalItens / $itensPorPagina);

        header('Content-Type: application/json');
        echo json_encode([
            'materiais' => $materiais,
            'totalPaginas' => $totalPaginas,
            'paginaAtual' => $pagina
        ]);
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
        exit;
    }
}

public function cadastrarMaterial($descricao, $unidade, $quantidade, $deposito, $estoque_minimo, $estoque_seguranca, $tipo_material, $segmento) {
        try {
            $conn = getConnection();
            $sql = "INSERT INTO estoque (descricao, unidade_medida, quantidade, deposito, estoque_minimo, estoque_seguranca, tipo_material, segmento) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$descricao, $unidade, $quantidade, $deposito, $estoque_minimo, $estoque_seguranca, $tipo_material, $segmento]);

            // Redireciona para home.php com mensagem de sucesso
            header("Location: http://localhost/almoxarifado/estoque-php/front/home.php?status=success");
            exit;
        } catch (PDOException $e) {
            // Redireciona para home.php com mensagem de erro
            header("Location: http://localhost/almoxarifado/estoque-php/front/home.php?status=error&message=" . urlencode($e->getMessage()));
            exit;
        }
    }
    

}


function verificarEstoque($produtoId) {
    $conn = getConnection();
    
    if (!$conn instanceof mysqli) {
        die("Erro na conexão com o banco de dados.");
    }

    $sql = "SELECT quantidade FROM estoque WHERE id = $produtoId";
    $result = $conn->query($sql);
    $quantidade = 0;

    if ($result && $row = $result->fetch_assoc()) {
        $quantidade = $row['quantidade'];
    }

    return $quantidade;
}




// Verifica se a ação é "listarMateriais" e chama a função
if (isset($_GET['action']) && $_GET['action'] === 'listarMateriais') {
    $controller = new EstoqueController();
    $controller->listarMateriais();
}

if (isset($_GET['action'])) {
    $controller = new EstoqueController();

    switch ($_GET['action']) {
        case 'listarMateriais':
            $pagina = isset($_GET['pagina']) ? (int)$_GET['pagina'] : 1;
            $itensPorPagina = isset($_GET['itensPorPagina']) ? (int)$_GET['itensPorPagina'] : 10;
            echo json_encode($controller->listarMateriais($pagina, $itensPorPagina));
            break;
        

        case 'listarTiposMaterial':
            echo json_encode($controller->listarTiposMaterial());
            break;

        case 'listarSegmentos':
            echo json_encode($controller->listarSegmentos());
            break;

            case 'excluirMaterial':
                if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
                    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
    
                    if ($id > 0) {
                        try {
                            $conn = getConnection();
                            $stmt = $conn->prepare("DELETE FROM estoque WHERE id = :id");
                            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
                            $stmt->execute();
    
                            echo json_encode(["success" => true]);
                        } catch (PDOException $e) {
                            http_response_code(500);
                            echo json_encode(["error" => "Erro ao excluir o material: " . $e->getMessage()]);
                        }
                    } else {
                        http_response_code(400);
                        echo json_encode(["error" => "ID inválido"]);
                    }
                } else {
                    http_response_code(405);
                    echo json_encode(["error" => "Método não permitido"]);
                }
                break;
    
            default:
                http_response_code(400);
                echo json_encode(["error" => "Ação inválida"]);
                break;
        }
        exit; // Finaliza a execução do script após processar o switch
    }

header('Content-Type: application/json');

if (isset($_GET['query'])) {
    try {
        $query = $_GET['query'];
        $conn = getConnection();
        $stmt = $conn->prepare("SELECT DISTINCT deposito FROM estoque WHERE deposito LIKE :query LIMIT 10");
        $stmt->bindValue(':query', '%' . $query . '%');
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($result);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Parâmetro query não fornecido']);
}
header('Content-Type: application/json');

try {
    $conn = getConnection();
    $stmt = $conn->query("SELECT DISTINCT segmento FROM estoque");
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}


if ($_GET['action'] === 'filtrarMateriais') {
    $descricao = $_GET['descricao'] ?? '';
    $tipo_material = $_GET['tipo_material'] ?? '';
    $segmento = $_GET['segmento'] ?? '';

    $query = "SELECT * FROM estoque WHERE 1=1";
    $params = [];

    if (!empty($descricao)) {
        $query .= " AND descricao LIKE :descricao";
        $params[':descricao'] = '%' . $descricao . '%';
    }

    if (!empty($tipo_material)) {
        $query .= " AND tipo_material = :tipo_material";
        $params[':tipo_material'] = $tipo_material;
    }

    if (!empty($segmento)) {
        $query .= " AND segmento = :segmento";
        $params[':segmento'] = $segmento;
    }

    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
    exit;
}



?>