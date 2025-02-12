<?php

// Ajuste o caminho conforme a estrutura do seu projeto
$autoloadPath = dirname(__DIR__, 2) . '/vendor/autoload.php';

// Verifique se o arquivo autoload.php existe antes de incluí-lo
if (!file_exists($autoloadPath)) {
    die("Erro: O arquivo autoload.php não foi encontrado no caminho esperado: $autoloadPath");
}

require_once $autoloadPath;

// Incluir manualmente as classes PHPMailer, SMTP e Exception se o autoload falhar
require_once dirname(__DIR__, 2) . '/vendor/phpmailer/phpmailer/src/PHPMailer.php';
require_once dirname(__DIR__, 2) . '/vendor/phpmailer/phpmailer/src/SMTP.php';
require_once dirname(__DIR__, 2) . '/vendor/phpmailer/phpmailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function enviarEmailSupervisor($produtosComEstoqueCritico) {
    if (empty($produtosComEstoqueCritico)) {
        echo "Nenhum produto com estoque crítico para enviar e-mail.<br>";
        return;
    }

    $mail = new PHPMailer(true);

    try {
        // Configurações do servidor SMTP da Hostinger
        $mail->isSMTP();
        $mail->Host = 'smtp.hostinger.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'testecurso@ongsuperacao.org';
        $mail->Password = '28171977Edu@';
        $mail->SMTPSecure = 'ssl';
        $mail->Port = 465;

        // Habilitar depuração detalhada do PHPMailer
        $mail->SMTPDebug = 0; // Altere para 2 para debug detalhado
        $mail->Debugoutput = 'html';

        // Configurações do e-mail
        $mail->CharSet = 'UTF-8';
        $mail->setFrom('testecurso@ongsuperacao.org', 'Sistema de Estoque');
        $mail->addAddress('supervisor@ongsuperacao.org', 'Supervisor do Estoque');

        // Criar tabela HTML com os produtos com estoque crítico
        $tabelaProdutos = '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">';
        $tabelaProdutos .= '<thead><tr style="background-color: #f2f2f2; text-align: left;">';
        $tabelaProdutos .= '<th>Produto</th><th>Quantidade Atual</th><th>Estoque Mínimo</th>';
        $tabelaProdutos .= '</tr></thead><tbody>';

        foreach ($produtosComEstoqueCritico as $produto) {
            $tabelaProdutos .= '<tr>';
            $tabelaProdutos .= '<td>' . htmlspecialchars($produto['descricao'], ENT_QUOTES, 'UTF-8') . '</td>';
            $tabelaProdutos .= '<td>' . htmlspecialchars($produto['quantidade'], ENT_QUOTES, 'UTF-8') . '</td>';
            $tabelaProdutos .= '<td>' . htmlspecialchars($produto['estoque_minimo'], ENT_QUOTES, 'UTF-8') . '</td>';
            $tabelaProdutos .= '</tr>';
        }

        $tabelaProdutos .= '</tbody></table>';

        // Conteúdo do e-mail
        $mail->isHTML(true);
        $mail->Subject = "Aviso: Produtos com Estoque Abaixo do Mínimo";
        $mail->Body = "
        <html>
        <head>
            <meta charset='UTF-8'>
            <title>Estoque Abaixo do Mínimo</title>
        </head>
        <body>
            <h3 style='color: #4a148c;'>Produtos com Estoque Crítico</h3>
            <p>Os seguintes produtos estão abaixo do estoque mínimo, Entre em contato com o almoxarifado para realizar a compra dos produtos.:</p>
            $tabelaProdutos
        </body>
        </html>
        ";

        // Enviar o e-mail
        if ($mail->send()) {
            echo "E-mail enviado com sucesso para o supervisor.<br>";
            echo " produtos que estao abaixo ".$produto['descricao'];
        } else {
            echo "Falha ao enviar o e-mail. Erro: " . $mail->ErrorInfo . "<br>";
        }
    } catch (Exception $e) {
        echo "Erro ao enviar e-mail: {$mail->ErrorInfo}<br>";
    }
}
