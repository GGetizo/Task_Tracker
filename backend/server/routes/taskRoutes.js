const express = require('express')
const taskController = require('../controllers/taskController.js')
const authMiddleware = require('../utils/auth.js')

const router = express.Router();
router.use(authMiddleware);

router.route('/')
    .get(taskController.getAllTasks)
    .post(taskController.createNewTask)
    .patch(taskController.updateTask)
    .delete(taskController.deleteTask)

    module.exports = router