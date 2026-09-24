const { Router } = require('express');
const router = Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', protect, userController.getAll);
router.get('/me', protect, userController.getMe);
router.get('/:id', protect, userController.getById);
router.post('/', protect, userController.create);
router.put('/:id', protect, userController.update);
router.delete('/:id', protect, userController.delete);

module.exports = router;