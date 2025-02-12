<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../db.php';
 // Inclua seu script de conexão ao banco de dados

class EstoqueController {

    // Função para listar materiais com filtros e paginação
    public function listarMateriais($descricao = '', $tipo_material = '', $segmento = '', $pagina = 1, $itensPorPagina = 10) {
        header('Content-Type: application/json');

        try {
            $conn = getConnection();
            $offset = ($pagina - 1) * $itensPorPagina;
    
            // Construindo a consulta SQL com filtros dinâmicos
            $sql = "SELECT * FROM estoque WHERE 1=1";
            $params = [];
    
            if (!empty($descricao)) {
                $sql .= " AND descricao LIKE :descricao";
                $params[':descricao'] = '%' . $descricao . '%';
            }
    
            if (!empty($tipo_material)) {
                $sql .= " AND tipo_material = :tipo_material";
                $params[':tipo_material'] = $tipo_material;
            }
    
            if (!empty($segmento)) {
                $sql .= " AND segmento = :segmento";
                $params[':segmento'] = $segmento;
            }
    
            // Adicionando LIMIT e OFFSET para paginação
            $sql .= " LIMIT :limit OFFSET :offset";
    
            $stmt = $conn->prepare($sql);
    
            // Vinculando os parâmetros ao statement
            foreach ($params as $key => $val) {
                $stmt->bindValue($key, $val);
            }
    
            $stmt->bindValue(':limit', $itensPorPagina, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    
            $stmt->execute();
            $materiais = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
            // Obter o total de itens para paginação
            $countSql = "SELECT COUNT(*) as total FROM estoque WHERE 1=1";
            $countParams = [];
            if (!empty($descricao)) {
                $countSql .= " AND descricao LIKE :descricao";
                $countParams[':descricao'] = '%' . $descricao . '%';
            }
            if (!empty($tipo_material)) {
                $countSql .= " AND tipo_material = :tipo_material";
                $countParams[':tipo_material'] = $tipo_material;
            }
            if (!empty($segmento)) {
                $countSql .= " AND segmento = :segmento";
                $countParams[':segmento'] = $segmento;
            }

            $countStmt = $conn->prepare($countSql);
            foreach ($countParams as $key => $val) {
                $countStmt->bindValue($key, $val);
            }
            $countStmt->execute();
            $totalItens = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
            $totalPaginas = ceil($totalItens / $itensPorPagina);
    
            // Resposta JSON
            echo json_encode([
                'materiais' => $materiais,
                'totalPaginas' => $totalPaginas,
                'paginaAtual' => $pagina
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    
    // Função para excluir material
    public function excluirMaterial($id) {
        header('Content-Type: application/json');
        try {
            $conn = getConnection();
            $stmt = $conn->prepare("DELETE FROM estoque WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    // Função para editar material
    public function editarMaterial($id, $descricao, $unidade_medida, $quantidade, $deposito, $estoque_minimo, $estoque_seguranca, $tipo_material, $segmento) {
        header('Content-Type: application/json');
        try {
            $conn = getConnection();
            $sql = "UPDATE estoque SET descricao = :descricao, unidade_medida = :unidade_medida, quantidade = :quantidade, deposito = :deposito, estoque_minimo = :estoque_minimo, estoque_seguranca = :estoque_seguranca, tipo_material = :tipo_material, segmento = :segmento WHERE id = :id";
            $stmt = $conn->prepare($sql);

            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':descricao', $descricao);
            $stmt->bindParam(':unidade_medida', $unidade_medida);
            $stmt->bindParam(':quantidade', $quantidade);
            $stmt->bindParam(':deposito', $deposito);
            $stmt->bindParam(':estoque_minimo', $estoque_minimo);
            $stmt->bindParam(':estoque_seguranca', $estoque_seguranca);
            $stmt->bindParam(':tipo_material', $tipo_material);
            $stmt->bindParam(':segmento', $segmento);

            $stmt->execute();

            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    // Função para listar tipos de material
    public function listarTiposMaterial() {
        header('Content-Type: application/json');
        try {
            $conn = getConnection();
            $sql = "SELECT DISTINCT descricao FROM tipo_material";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $tipos = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($tipos);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    // Função para listar segmentos
    public function listarSegmentos() {
        header('Content-Type: application/json');
        try {
            $conn = getConnection();
            $sql = "SELECT DISTINCT descricao FROM segmento";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $segmentos = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($segmentos);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

 // Função para buscar material por ID e retornar JSON para o frontend
 public function buscarMaterialPorId($id) {
    header('Content-Type: application/json');
    try {
        $conn = getConnection();
        $sql = "SELECT * FROM estoque WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $produto = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($produto) {
            echo json_encode($produto);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Produto não encontrado.']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
    
    

}

if (isset($_GET['action'])) {
    $controller = new EstoqueController();

    switch ($_GET['action']) {
        case 'listar':
            $descricao = isset($_GET['descricao']) ? $_GET['descricao'] : '';
            $tipo_material = isset($_GET['tipo_material']) ? $_GET['tipo_material'] : '';
            $segmento = isset($_GET['segmento']) ? $_GET['segmento'] : '';
            $pagina = isset($_GET['pagina']) ? (int)$_GET['pagina'] : 1;
            $controller->listarMateriais($descricao, $tipo_material, $segmento, $pagina);
            break;

        case 'buscarPorId':
            $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            $controller->buscarMaterialPorId($id);
            break;


        case 'excluir':
            $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            $controller->excluirMaterial($id);
            break;

        case 'editar':
            $id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
            $descricao = isset($_POST['descricao']) ? $_POST['descricao'] : '';
            $unidade_medida = isset($_POST['unidade_medida']) ? $_POST['unidade_medida'] : '';
            $quantidade = isset($_POST['quantidade']) ? $_POST['quantidade'] : 0;
            $deposito = isset($_POST['deposito']) ? $_POST['deposito'] : '';
            $estoque_minimo = isset($_POST['estoque_minimo']) ? $_POST['estoque_minimo'] : 0;
            $estoque_seguranca = isset($_POST['estoque_seguranca']) ? $_POST['estoque_seguranca'] : 0;
            $tipo_material = isset($_POST['tipo_material']) ? $_POST['tipo_material'] : '';
            $segmento = isset($_POST['segmento']) ? $_POST['segmento'] : '';
            $controller->editarMaterial($id, $descricao, $unidade_medida, $quantidade, $deposito, $estoque_minimo, $estoque_seguranca, $tipo_material, $segmento);
            break;

        case 'listarTiposMaterial':
            $controller->listarTiposMaterial();
            break;

        case 'listarSegmentos':
            $controller->listarSegmentos();
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Ação inválida']);
            break;
    }
}
?>
