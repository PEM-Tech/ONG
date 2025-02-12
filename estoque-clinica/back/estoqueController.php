<?php
session_start();
require_once 'db.php';


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


class EstoqueController {
    public function listarMateriais($pagina = 1, $itensPorPagina = 10) {
        try {
            $conn = getConnection();
    
            $offset = ($pagina - 1) * $itensPorPagina;
    
            $sql = "SELECT * FROM estoque LIMIT :limit OFFSET :offset";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':limit', $itensPorPagina, PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
    
            $materiais = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
            // Contar total de itens para calcular o número de páginas
            $totalItens = $conn->query("SELECT COUNT(*) FROM estoque")->fetchColumn();
            $totalPaginas = ceil($totalItens / $itensPorPagina);
    
            // Retornar os dados e a paginação
            return [
                'materiais' => $materiais,
                'totalPaginas' => $totalPaginas,
                'paginaAtual' => $pagina
            ];
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
            header("Location: http://localhost/estoque-php/front/home.php?status=success&message=" . urlencode("Material cadastrado com sucesso"));
            exit;

        } catch (PDOException $e) {
            // Redireciona para home.php com mensagem de erro
            header("Location:  http://localhost/estoque-php/front/home.php?status=error&message=" . urlencode($e->getMessage()));
            exit;
        }
    }

    public function buscarMateriais() {
        $conn = getConnection();
        if (!$conn) {
            die("Erro ao conectar ao banco de dados");
        }
    
        // Inclua 'preco' na consulta SQL
        $sql = "SELECT id, descricao, unidade_medida, quantidade, deposito, estoque_minimo, estoque_seguranca, tipo_material, segmento, preco FROM estoque";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function buscarMaterialPorId($id) {
        try {
            $conn = getConnection();
            $sql = "SELECT * FROM estoque WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Erro ao buscar material: " . $e->getMessage());
        }
    }
    

    public function atualizarMaterial($id, $descricao, $unidade_medida, $quantidade, $deposito, $estoque_minimo, $estoque_seguranca, $tipo_material, $segmento) {
        try {
            $conn = getConnection();
            $sql = "UPDATE estoque 
                    SET descricao = :descricao,
                        unidade_medida = :unidade_medida,
                        quantidade = :quantidade,
                        deposito = :deposito,
                        estoque_minimo = :estoque_minimo,
                        estoque_seguranca = :estoque_seguranca,
                        tipo_material = :tipo_material,
                        segmento = :segmento
                    WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':descricao', $descricao);
            $stmt->bindParam(':unidade_medida', $unidade_medida);
            $stmt->bindParam(':quantidade', $quantidade);
            $stmt->bindParam(':deposito', $deposito);
            $stmt->bindParam(':estoque_minimo', $estoque_minimo);
            $stmt->bindParam(':estoque_seguranca', $estoque_seguranca);
            $stmt->bindParam(':tipo_material', $tipo_material);
            $stmt->bindParam(':segmento', $segmento);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception("Erro ao atualizar material: " . $e->getMessage());
        }
    }
    
    
    public function emitirNotaFiscal($produtos, $usuarioId) {
        $conn = getConnection();
        try {
            $conn->beginTransaction();
    
            $totalNota = 0;
            $precos = []; // Cache dos preços
    
            foreach ($produtos as $produto) {
                $produtoId = $produto['produto_id'];
                $quantidade = $produto['quantidade'];
    
                if (!isset($precos[$produtoId])) {
                    $stmt = $conn->prepare("SELECT descricao, quantidade, preco, estoque_minimo FROM estoque WHERE id = ?");
                    $stmt->execute([$produtoId]);
                    $produtoData = $stmt->fetch(PDO::FETCH_ASSOC);
    
                    if (!$produtoData) {
                        throw new Exception('Produto não encontrado');
                    }
    
                    $precos[$produtoId] = $produtoData['preco'];
                    $estoqueAtual = $produtoData['quantidade'];
    
                    // Verifica se há estoque suficiente para cada produto
                    if ($estoqueAtual < $quantidade) {
                        throw new Exception("Estoque insuficiente para o produto ID: $produtoId");
                    }
                }
    
                $subtotal = $quantidade * $precos[$produtoId];
                $totalNota += $subtotal;
            }
    
            // Inserir a nota fiscal na tabela 'notas'
            $stmt = $conn->prepare("INSERT INTO notas (usuario_id, data_venda, hora_venda, total_venda) VALUES (?, CURDATE(), CURTIME(), ?)");
            $stmt->execute([$usuarioId, $totalNota]);
            $notaId = $conn->lastInsertId();
    
            foreach ($produtos as $produto) {
                $produtoId = $produto['produto_id'];
                $quantidade = $produto['quantidade'];
                $preco = $precos[$produtoId];
                $subtotal = $quantidade * $preco;
    
                // Inserir os itens da nota fiscal na tabela 'nota_itens'
                $stmtItem = $conn->prepare("INSERT INTO nota_itens (nota_id, produto_id, quantidade, preco_unitario, subtotal) VALUES (?, ?, ?, ?, ?)");
                $stmtItem->execute([$notaId, $produtoId, $quantidade, $preco, $subtotal]);
    
                // Atualizar o estoque do produto
                $stmtEstoque = $conn->prepare("UPDATE estoque SET quantidade = quantidade - ? WHERE id = ?");
                $stmtEstoque->execute([$quantidade, $produtoId]);
    
            }
    
            $conn->commit();
            return ['success' => true];
        } catch (Exception $e) {
            $conn->rollBack();
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
    
    public function verificarEstoque($produtoId, $quantidadeSolicitada) {
        $conn = getConnection();
        $stmt = $conn->prepare("SELECT quantidade FROM estoque WHERE id = ?");
        $stmt->execute([$produtoId]);
        $produto = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if ($produto && $produto['quantidade'] >= $quantidadeSolicitada) {
            return true; // Quantidade suficiente disponível
        } else {
            return false; // Quantidade insuficiente
        }
    }

    public function listarTiposMaterial() {
        try {
            $conn = getConnection();
            $sql = "SELECT DISTINCT tipo_material FROM estoque ORDER BY tipo_material ASC";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $tiposMaterial = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $tiposMaterial;
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => $e->getMessage()];
        }
    }

    public function listarSegmentos() {
        try {
            $conn = getConnection();
            $sql = "SELECT DISTINCT segmento FROM estoque ORDER BY segmento ASC";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $segmentos = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $segmentos;
        } catch (PDOException $e) {
            http_response_code(500);
            return ['error' => $e->getMessage()];
        }
    }
    public function listarGruposDeMercadoria() {
        try {
            $conn = getConnection();
            $sql = "SELECT DISTINCT segmento FROM estoque ORDER BY segmento ASC";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Erro ao listar grupos de mercadoria: " . $e->getMessage());
        }
    }
    
    public function listarTiposDeMaterial() {
        try {
            $conn = getConnection();
            $sql = "SELECT DISTINCT tipo_material FROM estoque ORDER BY tipo_material ASC";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Erro ao listar tipos de material: " . $e->getMessage());
        }
    }

   
    
    
}


    
// Verifica se o formulário foi enviado
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action']) && $_POST['action'] == 'cadastrar') {
    $descricao = $_POST['descricao'];
    $unidade = $_POST['unidade_medida'];
    $quantidade = $_POST['quantidade'];
    $deposito = $_POST['deposito'];
    $estoque_minimo = $_POST['estoque_minimo'];
    $estoque_seguranca = $_POST['estoque_seguranca'];
    $tipo_material = $_POST['tipo_material'];
    $segmento = $_POST['segmento'];
    $estoqueController = new EstoqueController();
    $estoqueController->cadastrarMaterial($descricao, $unidade, $quantidade, $deposito, $estoque_minimo, $estoque_seguranca, $tipo_material, $segmento);
}

// Processamento do formulário de emissão de nota
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'emitirNota') {
    // Captura os dados enviados pelo formulário
    $produtos = json_decode($_POST['itens'], true);

    $estoqueController = new EstoqueController();
    $result = $estoqueController->emitirNotaFiscal($produtos, $usuarioId);
    
    // Redireciona de volta para emissao_notas.php com a mensagem de status
    if ($result['success']) {
        header('Location: ../front/emissao_notas.php?status=success&message=' . urlencode('Nota emitida com sucesso'));
    } else {
        header('Location: ../front/emissao_notas.php?status=error&message=' . urlencode($result['message']));
    }
    exit;
}


if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'verificarEstoque') {
    $produtoId = $_GET['produto_id'];
    $quantidade = $_GET['quantidade'];

    $estoqueController = new EstoqueController();
    $disponivel = $estoqueController->verificarEstoque($produtoId, $quantidade);

    header('Content-Type: application/json');
    echo json_encode(['success' => $disponivel]);
    exit;
}

// Verifica se a ação foi passada via GET
if (isset($_GET['action'])) {
    $controller = new EstoqueController();

    switch ($_GET['action']) {
        case 'listarMateriais':
            header('Content-Type: application/json');
            echo json_encode($controller->listarMateriais());
            break;

        case 'listarTiposMaterial':
            header('Content-Type: application/json');
            echo json_encode($controller->listarTiposMaterial());
            break;

        case 'listarSegmentos':
            header('Content-Type: application/json');
            echo json_encode($controller->listarSegmentos());
            break;

        case 'listarGruposDeMercadoria':
            header('Content-Type: application/json');
            echo json_encode($controller->listarGruposDeMercadoria());
            break;

        case 'listarTiposDeMaterial':
            header('Content-Type: application/json');
            echo json_encode($controller->listarTiposDeMaterial());
            break;
            case 'listarMateriais':
                $pagina = isset($_GET['pagina']) ? (int)$_GET['pagina'] : 1;
                $itensPorPagina = isset($_GET['itensPorPagina']) ? (int)$_GET['itensPorPagina'] : 10;
            
                header('Content-Type: application/json');
                echo json_encode($controller->listarMateriais($pagina, $itensPorPagina));
                break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Ação inválida']);
            break;
    }
    exit; // Finaliza o processamento após tratar a ação
}


?>