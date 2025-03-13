const express = require('express');
const router = express.Router();
const tiposConsultaController = require('../controllers/tipoConsultaController');

router.get('/', tiposConsultaController.getAllTiposConsulta);
router.get('/:id', tiposConsultaController.getTipoConsultaById);
router.post('/', tiposConsultaController.createTipoConsulta);
router.put('/:id', tiposConsultaController.updateTipoConsulta);
router.delete('/:id', tiposConsultaController.deleteTipoConsulta);

module.exports = router;
