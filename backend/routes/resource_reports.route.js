const { Router } = require('express')
const router = new Router()
const resourceReportsController = require('../controllers/resource_reports.controller')
const { protect } = require('../middlewares/auth.middleware')

router.get('/', resourceReportsController.getAll)
router.put('/:id', protect, resourceReportsController.update)
router.post('/', protect, resourceReportsController.create)
router.delete('/:id', protect, resourceReportsController.delete)

module.exports = router