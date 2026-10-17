const { Router } = require("express")
const router = Router()
const salesController = require('../controllers/sale.controller')

router.get('/', salesController.getAll);
router.get('/:id', salesController.getById);

module.exports = router