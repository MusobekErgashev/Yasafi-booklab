const { Router } = require('express')
const router = Router()
const debtorController = require('../controllers/debtor.controller')
const { protect } = require('../middlewares/auth.middleware')

router.get('/', protect, debtorController.getAll)
router.put('/:id', protect, debtorController.update)

module.exports = router