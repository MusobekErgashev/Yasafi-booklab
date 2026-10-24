const { Router } = require('express');
const router = Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.post('/change-password', protect, authController.changePassword);

router.get('/sessions', protect, authController.getSessions);
router.delete('/sessions/others', protect, authController.terminateOtherSessions);
router.delete('/sessions/:id', protect, authController.deleteSession);

module.exports = router;