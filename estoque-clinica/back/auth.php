<?php
require_once __DIR__ . '/db.php';  // Inclui a conexão com o banco de dados

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Verifique se o usuário está logado
if (!isset($_SESSION['usuario_id'])) {
    header('Location: ../index.php?error=not_logged_in');
    exit();
}

// Obtenha o nome do arquivo atual
$paginaAtual = basename($_SERVER['PHP_SELF']);
$usuarioFuncaoId = $_SESSION['usuario_funcao_id'] ?? '';  // Usar o funcao_id que é um valor inteiro

// Carregar permissões do banco de dados
try {
    $conn = getConnection();

    // Obter o ID da página atual
    $stmtPagina = $conn->prepare("SELECT id FROM paginas WHERE nome = :nome");
    $stmtPagina->bindParam(':nome', $paginaAtual);
    $stmtPagina->execute();
    $pagina = $stmtPagina->fetch(PDO::FETCH_ASSOC);

    if (!$pagina) {
        // Página não encontrada no banco de dados
        echo "Erro: Página não encontrada no banco de dados!";
        die();
    }

    $paginaId = $pagina['id'];

    // Verificar se a função do usuário tem permissão para acessar a página
    $stmtPermissao = $conn->prepare("SELECT COUNT(*) FROM permissoes_paginas WHERE pagina_id = :pagina_id AND funcao_id = :funcao_id");
    $stmtPermissao->bindParam(':pagina_id', $paginaId, PDO::PARAM_INT);
    $stmtPermissao->bindParam(':funcao_id', $usuarioFuncaoId, PDO::PARAM_INT);
    $stmtPermissao->execute();

    $temPermissao = $stmtPermissao->fetchColumn() > 0;

    if (!$temPermissao) {
        // Função do usuário não está permitida para acessar esta página
        echo "Erro: Função do usuário não está permitida para acessar esta página!";
        echo "<br>Página ID: " . $paginaId;
        echo "<br>Função ID do Usuário: " . $usuarioFuncaoId;
        die();
    }
} catch (PDOException $e) {
    die('Erro ao verificar permissões: ' . $e->getMessage());
}
