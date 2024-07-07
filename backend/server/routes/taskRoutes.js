const express = require('express')
const taskController = require('../controllers/taskController.js')
const authMiddleware = require('../utils/auth.js')

const router = express.Router();
//router.use(authMiddleware);

router.get('/', taskController.getAllTasks);

router.get('/getTask', taskController.getUserTasks);

router.post('/newTask', authMiddleware, taskController.createNewTask);

router.patch('/updateTask/:id', taskController.updateTask);

router.delete('/deleteTask/:id', taskController.deleteTask);

module.exports = router