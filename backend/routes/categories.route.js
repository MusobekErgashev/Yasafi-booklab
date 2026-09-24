const { Router } = require('express');
const router = Router();
const categoryController = require('../controllers/category.controller');

router.get('/', categoryController.getAllCategories);
router.post('/', categoryController.createCategory);
router.put('/', categoryController.updateCategory);
router.delete('/', categoryController.deleteCategory);

module.exports = router;