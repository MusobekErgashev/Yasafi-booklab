const { Router } = require('express')
const router = Router()
const debtorController = require('../controllers/debtor.controller')

router.get('/', debtorController.getAll)
router.put('/:id', debtorController.update)

module.exports = router