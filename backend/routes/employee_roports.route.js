const { Router } = require('express')
const router = new Router()
const employeeReportsController = require('../controllers/employee_reports.controller')
const { protect } = require('../middlewares/auth.middleware')

router.get('/', employeeReportsController.getAll)
router.patch('/:id', protect, employeeReportsController.update)
router.post('/', protect, employeeReportsController.create)
router.delete('/:id', protect, employeeReportsController.delete)

module.exports = router