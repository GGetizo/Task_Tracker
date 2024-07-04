import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js'; // Adjust path if necessary
import { authMiddleware } from '../utils/auth.js'; // Adjust path to auth.js

const router = express.Router();

router.use(authMiddleware);

// Define routes
router.post('/register', registerUser); // Register a new user
router.post('/login', loginUser); // Login a user

export default router;

