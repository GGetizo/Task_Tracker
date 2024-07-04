import express from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js'; // Adjust path if necessary
import { authMiddleware } from '../utils/auth.js'; // Adjust path to auth.js

const router = express.Router();

// Apply authentication middleware to protect routes
router.use(authMiddleware);

// Define routes
router.get('/', getTasks); // Retrieve all tasks
router.post('/', createTask); // Create a new task
router.put('/:id', updateTask); // Update an existing task
router.delete('/:id', deleteTask); // Delete a task

export default router;

