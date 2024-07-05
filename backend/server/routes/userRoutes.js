const express = require('express');
const userController = require('../controllers/userController.js');
const router = express.Router();

// Route to create a new user
router.post('/register', userController.createNewUser);
router.get('/', userController.getAllUsers)


// Route to login a user
router.post('/login', userController.loginUser);

module.exports = router;
