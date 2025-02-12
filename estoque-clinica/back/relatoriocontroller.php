<?php
require_once 'db.php';

class Relatorio {
    private $conn;

    public function __construct($conn = null) {
        if ($conn === null) {
            $this->conn = getConnection();
            if ($this->conn === null) {
                throw new Exception("Falha ao estabelecer a conexão com o banco de dados.");
            }
        } else {
            $this->conn = $conn;
        }
    }

    public function getNotaDetalhe($notaId) {
        $stmt = $this->conn->prepare("SELECT ni.*, e.descricao FROM nota_itens ni JOIN estoque e ON ni.produto_id = e.id WHERE ni.nota_id = :nota_id");
        $stmt->bindParam(':nota_id', $notaId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getNotasPorUsuario($usuarioId, $limit, $offset) {
        $stmt = $this->conn->prepare("SELECT id, usuario_id, data_venda, hora_venda, total_venda FROM notas WHERE usuario_id = :usuario_id LIMIT :limit OFFSET :offset");
        $stmt->bindParam(':usuario_id', $usuarioId, PDO::PARAM_INT);
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function contarNotasPorUsuario($usuarioId) {
        $stmt = $this->conn->prepare("SELECT COUNT(*) as total FROM notas WHERE usuario_id = :usuario_id");
        $stmt->bindParam(':usuario_id', $usuarioId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    }

    public function getTodasNotas($limit, $offset) {
        $stmt = $this->conn->prepare("SELECT id, usuario_id, data_venda, hora_venda, total_venda FROM notas LIMIT :limit OFFSET :offset");
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function contarTodasNotas() {
        $stmt = $this->conn->prepare("SELECT COUNT(*) as total FROM notas");
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    }

    public function getNotasPorMes() {
        $stmt = $this->conn->prepare("SELECT MONTH(data_venda) as mes, COUNT(*) as total FROM notas GROUP BY MONTH(data_venda)");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getNotasPorAno() {
        $stmt = $this->conn->prepare("SELECT YEAR(data_venda) as ano, COUNT(*) as total FROM notas GROUP BY YEAR(data_venda)");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getNotasPorUsuarios() {
        $stmt = $this->conn->prepare("SELECT usuario_id, COUNT(*) as total FROM notas GROUP BY usuario_id");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
