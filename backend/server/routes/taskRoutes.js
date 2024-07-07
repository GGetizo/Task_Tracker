const express = require('express');
const taskController = require('../controllers/taskController.js');
const authMiddleware = require('../utils/auth.js');

const router = express.Router();
router.use(authMiddleware); // Apply auth middleware to all routes

// Define routes
router.get('/', taskController.getAllTasks);
router.get('/getTask', taskController.getUserTasks);
router.post('/newTask', taskController.createTask);
router.patch('/:id', taskController.updateTask);
router.delete('/deleteTask/:id', taskController.deleteTask);

module.exports = router;