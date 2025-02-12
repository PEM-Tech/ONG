<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once dirname(__DIR__) . '/scripts/enviarEmailSupervisor.php';
require_once __DIR__ . '/../db.php';

function verificarEstoqueMinimo() {
    try {
        $conn = getConnection();
        
        // Buscando todos os produtos que estão abaixo do estoque mínimo
        $sql = "SELECT descricao, quantidade, estoque_minimo FROM estoque WHERE quantidade < estoque_minimo";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $produtos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Se houver produtos abaixo do estoque mínimo, enviar e-mail
        if ($produtos && count($produtos) > 0) {
            echo "Produtos abaixo do estoque mínimo encontrados:<br>";
            
            foreach ($produtos as $produto) {
                echo "- Produto: " . htmlspecialchars($produto['descricao'], ENT_QUOTES, 'UTF-8') . 
                     " | Quantidade Atual: " . htmlspecialchars($produto['quantidade'], ENT_QUOTES, 'UTF-8') . 
                     " | Estoque Mínimo: " . htmlspecialchars($produto['estoque_minimo'], ENT_QUOTES, 'UTF-8') . "<br>";
            }

            // Enviar e-mail para o supervisor com os produtos abaixo do mínimo
            enviarEmailSupervisor($produtos);
        } else {
            echo "Nenhum produto abaixo do estoque mínimo foi encontrado.<br>";
        }
    } catch (PDOException $e) {
        error_log("Erro ao verificar estoque: " . $e->getMessage());
    }
}

// Testar a função de verificação
verificarEstoqueMinimo();
