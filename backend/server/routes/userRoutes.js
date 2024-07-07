const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const verifyToken = require('../utils/auth'); // Middleware for JWT verification

// Route to register a new user
router.post('/register', userController.createNewUser);

// Route to login a user
router.post('/login', userController.loginUser);

// For testing user input
router.get('/', userController.getAllUsers);

// Optional: Route to get the current user's details (assuming getUser function is defined)
router.get('/me', verifyToken, userController.getUser);

// Router for logout
router.post('/logout', userController.logoutUser);

module.exports = router;
