// backend/routes/anamnese.routes.js
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const anamneseController = require("../controllers/anamneseController");
const verificarToken = require("../middlewares/authMiddleware");

// Exemplo de validações para os campos da anamnese
const validations = [
  body("assistido_id")
    .notEmpty()
    .withMessage("O campo assistido_id é obrigatório."),
  // Adicione outras validações conforme os campos da ficha de anamnese
  // body("nome").isLength({ min: 3 }).withMessage("Nome deve ter pelo menos 3 caracteres."),
];

// Rota para criar uma nova ficha de anamnese
router.post(
  "/",
  verificarToken,
  validations,
  anamneseController.createAnamnese
);

// Rota para buscar a ficha de anamnese com base na ficha do assistido
router.get("/:ficha", verificarToken, anamneseController.getAnamnese);

// Rota para atualizar uma ficha de anamnese
router.put(
  "/:ficha",
  verificarToken,
  validations,
  anamneseController.updateAnamnese
);

// Rota para excluir uma ficha de anamnese
router.delete("/:ficha", verificarToken, anamneseController.deleteAnamnese);

module.exports = router;
