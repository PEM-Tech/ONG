<?php
require 'enviarEmailSupervisor.php';

function testarEnvioEmail() {
    $descricaoProduto = "Produto Teste";
    $quantidadeAtual = 5; // Exemplo de quantidade abaixo do mínimo

    // Chama a função para enviar o e-mail
    enviarEmailSupervisor($descricaoProduto, $quantidadeAtual);
}

// Executa o teste
testarEnvioEmail();
?>
