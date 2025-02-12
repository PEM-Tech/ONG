<?php
require_once '../back/estoqueController.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'];
    $descricao = $_POST['descricao'];
    $unidade_medida = $_POST['unidade_medida'];
    $quantidade = $_POST['quantidade'];
    $deposito = $_POST['deposito'];
    $estoque_minimo = $_POST['estoque_minimo'];
    $estoque_seguranca = $_POST['estoque_seguranca'];
    $tipo_material = $_POST['tipo_material'];
    $segmento = $_POST['segmento'];

    $controller = new EstoqueController();

    try {
        $controller->atualizarMaterial($id, $descricao, $unidade_medida, $quantidade, $deposito, $estoque_minimo, $estoque_seguranca, $tipo_material, $segmento);

        echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
        echo "<script>
                document.addEventListener('DOMContentLoaded', function() {
                    Swal.fire({
                        title: 'Sucesso!',
                        text: 'Produto atualizado com sucesso.',
                        icon: 'success'
                    }).then(() => {
                        window.location.href = 'consulta_deposito.php';
                    });
                });
              </script>";
    } catch (Exception $e) {
        echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
        echo "<script>
                document.addEventListener('DOMContentLoaded', function() {
                    Swal.fire({
                        title: 'Erro!',
                        text: 'Erro ao atualizar o produto: {$e->getMessage()}',
                        icon: 'error'
                    }).then(() => {
                        window.location.href = 'editar_produto.php?id=$id';
                    });
                });
              </script>";
    }
}
?>
