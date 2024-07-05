const express = require('express')
const userController =  require('../controllers/userController.js')

const router = express.Router();

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createNewUser)
    .get(userController.loginUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

router.route('/:id')
    .get(userController.getUser)
    .delete(userController.deleteUserById)

module.exports = router
