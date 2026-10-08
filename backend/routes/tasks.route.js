const { Router } = require("express")
const taskController = require("../controllers/task.controller")
const { protect } = require("../middlewares/auth.middleware")
const router = Router()

router.get('/', protect, taskController.getAll)
router.post('/', protect, taskController.create)
router.patch('/status/:id', protect, taskController.changeStatus)
router.patch('/started/:id', protect, taskController.changeStartedDate)
router.patch('/finished/:id', protect, taskController.changeFinishedDate)
router.put('/:id', protect, taskController.update)
router.delete('/:id', protect, taskController.delete)

module.exports = router