const { Router } = require('express');
const router = Router();

router.use('/auth', require('./auth.route'));
router.use('/users', require('./users.route'));
router.use('/books', require('./books.route'));
router.use('/categories', require('./categories.route'));
router.use('/orders', require('./orders.route'));
router.use('/customers', require('./customers.route'));

module.exports = router;