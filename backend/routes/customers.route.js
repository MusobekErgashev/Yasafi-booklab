const { Router } = require("express");
const router = Router();
const customerController = require("../controllers/customer.controller");

router.get("/", customerController.getAllCustomers);
router.post('/', customerController.createCustomer);
router.get('/:id', customerController.getById)
router.put('/:id', customerController.update)
router.patch('/:id', customerController.updateDebt)
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;