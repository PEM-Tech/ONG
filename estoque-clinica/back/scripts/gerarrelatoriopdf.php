<?php
require '../../libs/fpdf.php'; // Inclua o arquivo fpdf.php manualmente
require('../db.php'); // Inclua seu arquivo de conexão ao banco de dados

// Função para gerar o relatório
class PDF extends FPDF {
    // Cabeçalho do PDF
    function Header() {
        // Título
        $this->SetFont('Arial', 'B', 14);
        $this->Cell(0, 10, utf8_decode('Relatório de Estoque'), 0, 1, 'C');
        $this->Ln(10); // Espaço
    }

    // Rodapé do PDF
    function Footer() {
        $this->SetY(-15); // A 15 mm do final da página
        $this->SetFont('Arial', 'I', 8);
        $this->Cell(0, 10, utf8_decode('Página ') . $this->PageNo() . '/{nb}', 0, 0, 'C');
    }
}

// Instância de um objeto PDF
$pdf = new PDF();
$pdf->AliasNbPages();
$pdf->AddPage();
$pdf->SetFont('Arial', '', 12);

// Conectar ao banco de dados e buscar os itens
$conn = getConnection(); // Supondo que `getConnection()` retorne a conexão PDO
if ($conn) {
    try {
        $sql = "SELECT descricao, unidade_medida, quantidade, deposito, estoque_minimo, estoque_seguranca, tipo_material, segmento FROM estoque";
        $stmt = $conn->prepare($sql);
        $stmt->execute();

        // Cabeçalho da tabela no PDF
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell(50, 10, utf8_decode('Descrição'), 1);
        $pdf->Cell(30, 10, utf8_decode('Unid. Medida'), 1);
        $pdf->Cell(20, 10, 'Quant.', 1);
        $pdf->Cell(30, 10, utf8_decode('Depósito'), 1);
        $pdf->Cell(30, 10, utf8_decode('Estoque Min.'), 1);
        $pdf->Cell(30, 10, utf8_decode('Estoque Seg.'), 1);
        $pdf->Ln();

        // Iterar pelos resultados e adicioná-los no PDF
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $pdf->SetFont('Arial', '', 10);
            $pdf->Cell(50, 10, utf8_decode($row['descricao']), 1);
            $pdf->Cell(30, 10, utf8_decode($row['unidade_medida']), 1);
            $pdf->Cell(20, 10, $row['quantidade'], 1);
            $pdf->Cell(30, 10, utf8_decode($row['deposito']), 1);
            $pdf->Cell(30, 10, $row['estoque_minimo'], 1);
            $pdf->Cell(30, 10, $row['estoque_seguranca'], 1);
            $pdf->Ln();
        }

    } catch (PDOException $e) {
        echo 'Erro ao buscar dados do estoque: ' . $e->getMessage();
        exit();
    }
} else {
    echo 'Erro ao conectar ao banco de dados.';
    exit();
}

// Saída do arquivo PDF
$pdf->Output('D', 'relatorio_estoque.pdf'); // O 'D' força o download
?>

