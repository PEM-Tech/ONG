<?php
session_start();
require_once __DIR__ . '/../db.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

class EditarProdutoController {

    // Função para buscar material por ID e retornar JSON
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

    // Função para listar depósitos dinamicamente
    public function listarDepositos() {
        header('Content-Type: application/json');
        try {
            $conn = getConnection();
            $sql = "SELECT id, descricao FROM deposito ORDER BY descricao ASC";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $depositos = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($depositos);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    // Função para listar segmentos dinamicamente
    public function listarSegmentos() {
        header('Content-Type: application/json');
        try {
            $conn = getConnection();
            $sql = "SELECT id, descricao FROM segmento ORDER BY descricao ASC";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $segmentos = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($segmentos);
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

    // Função para listar unidades de medida dinamicamente
    public function listarUnidadesDeMedida() {
        header('Content-Type: application/json');
        try {
            $conn = getConnection();
            $sql = "SELECT id, descricao FROM unidade_medida ORDER BY descricao ASC";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $unidades = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($unidades);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    // Função para listar tipos de material dinamicamente
    public function listarTiposDeMaterial() {
        header('Content-Type: application/json');
        try {
            $conn = getConnection();
            $sql = "SELECT id, descricao FROM tipo_material ORDER BY descricao ASC";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $tipos = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($tipos);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}

if (isset($_GET['action'])) {
    $controller = new EditarProdutoController();

    switch ($_GET['action']) {
        case 'buscarPorId':
            $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            $controller->buscarMaterialPorId($id);
            break;

        case 'listarDepositos':
            $controller->listarDepositos();
            break;

        case 'listarSegmentos':
            $controller->listarSegmentos();
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

        case 'listarUnidadesDeMedida':
            $controller->listarUnidadesDeMedida();
            break;

        case 'listarTiposDeMaterial':
            $controller->listarTiposDeMaterial();
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Ação inválida']);
            break;
    }
}
?>