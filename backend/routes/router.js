const { Router } = require('express');
const router = Router();

router.use('/auth', require('./auth.route'));
router.use('/users', require('./users.route'));
router.use('/books', require('./books.route'));
router.use('/categories', require('./categories.route'));
router.use('/orders', require('./orders.route'));
router.use('/customers', require('./customers.route'));
router.use('/employee-reports', require('./employee_roports.route'));
router.use('/resource-reports', require('./resource_reports.route'));
router.use('/tasks', require('./tasks.route'))

module.exports = router;