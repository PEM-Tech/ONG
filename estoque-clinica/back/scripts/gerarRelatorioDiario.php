<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../scripts/enviarEmailSupervisor.php'; // Reutilizando seu script atual para enviar e-mail

function gerarRelatorioDiario() {
    $conn = getConnection();
    
    // Busca todas as vendas do dia
    $stmt = $conn->prepare("
        SELECT v.produto_id, p.descricao, SUM(v.quantidade) AS total_quantidade, v.preco_unitario
        FROM vendas_diarias v
        JOIN estoque p ON v.produto_id = p.id
        WHERE DATE(v.data_venda) = CURDATE()
        GROUP BY v.produto_id
    ");
    $stmt->execute();
    $vendas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Monta o corpo do e-mail em formato HTML para o relatório diário
    $corpoEmail = "<h1>Relatório de Vendas do Dia</h1>";
    $corpoEmail .= "<table border='1' cellpadding='10' cellspacing='0'>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Quantidade Vendida</th>
                                <th>Preço Unitário</th>
                            </tr>
                        </thead>
                        <tbody>";
    
    if ($vendas && count($vendas) > 0) {
        foreach ($vendas as $venda) {
            $corpoEmail .= "<tr>
                                <td>{$venda['descricao']}</td>
                                <td>{$venda['total_quantidade']}</td>
                                <td>R$ {$venda['preco_unitario']}</td>
                            </tr>";
        }
    } else {
        $corpoEmail .= "<tr><td colspan='3'>Nenhuma venda registrada hoje.</td></tr>";
    }

    $corpoEmail .= "</tbody></table>";

    // Busca produtos abaixo do estoque mínimo
    $stmt = $conn->prepare("SELECT descricao, quantidade, estoque_minimo FROM estoque WHERE quantidade < estoque_minimo");
    $stmt->execute();
    $produtosCriticos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Verifica se existem produtos abaixo do estoque mínimo e monta a tabela
    if ($produtosCriticos && count($produtosCriticos) > 0) {
        $corpoEmail .= "<h2>Produtos Abaixo do Estoque Mínimo</h2>";
        $corpoEmail .= "<table border='1' cellpadding='10' cellspacing='0'>
                            <thead>
                                <tr>
                                    <th>Produto</th>
                                    <th>Quantidade Atual</th>
                                    <th>Estoque Mínimo</th>
                                </tr>
                            </thead>
                            <tbody>";
        foreach ($produtosCriticos as $produto) {
            $corpoEmail .= "<tr>
                                <td>{$produto['descricao']}</td>
                                <td>{$produto['quantidade']}</td>
                                <td>{$produto['estoque_minimo']}</td>
                            </tr>";
        }
        $corpoEmail .= "</tbody></table>";
    } else {
        $corpoEmail .= "<p>Todos os produtos estão acima do estoque mínimo.</p>";
    }

    // Chama a função enviarEmailSupervisor() para enviar o relatório diário com o corpo montado
    enviarEmailSupervisor($produtosCriticos);
}

// Executa a função para gerar o relatório
gerarRelatorioDiario();
?>
