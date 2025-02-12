<?php
require_once '../back/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['notificacao_id'])) {
    $notificacaoId = $_POST['notificacao_id'];
    $conn = getConnection();

    // Atualizar a notificação para marcada como visualizada
    $stmt = $conn->prepare("UPDATE notificacoes_estoque SET visualizado = TRUE WHERE id = ?");
    $stmt->execute([$notificacaoId]);

    // Redirecionar de volta para a página de notificações
    header('Location: painel_estoque.php?status=success&message=' . urlencode('Notificação marcada como visualizada.'));
    exit;
}
?>
