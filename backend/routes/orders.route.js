const { Router } = require("express");
const router = Router();
const orderController = require("../controllers/order.controller")

router.get('/', orderController.getAllOrders)
router.post('/', orderController.createOrder)
router.put('/:id', orderController.updateOrder)
router.patch('/:id', orderController.updateStatus)
router.get('/status/:telegram_id', orderController.getOrderStatus)
router.delete('/:id', orderController.deleteOrder)

module.exports = router;