const User = require('../models/User')
const Task =  require('../models/Task.js')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// @desc Register new user
// @route POST /users/register
// @access Public

const createNewUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    // Confirm data
    if (!username || !password ) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

    const userObject = { username, "password": hashedPwd}

    // Create and store new user 
    const user = await User.create(userObject)

    if (user) { //created 
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

// @desc Login user
// @route POST /users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email }).exec();

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": user.username,
                "email": user.email,
                "userId": user._id
            }
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.json({ accessToken });
});

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    // Get all users from MongoDB
    const users = await User.find().select('-password').lean();

    // If no users
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' });
    }

    res.json(users);
});

const getUser = asyncHandler(async (req, res) => {
    const userID = req.params.id;

    const user = await User.findById(userID).select('-password').lean();

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    res.json(user);
});

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, email, password } = req.body;

    // Confirm data
    if (!id || !username || !email || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' });
    }

    // Does the user exist to update?
    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    // Check for duplicate username or email
    const duplicate = await User.findOne({ $or: [{ username }, { email }] }).lean().exec();

    // Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username or email' });
    }

    user.username = username;
    user.email = email;

    if (password) {
        // Hash password
        user.password = await bcrypt.hash(password, 10); // salt rounds
    }

    const updatedUser = await user.save();

    res.json({ message: `${updatedUser.username} updated` });
});

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'User ID required' });
    }
    const task = await Task.findOne({ user: id }).lean().exec();
    if (task) {
        return res.status(400).json({ message: 'User has assigned Task' });
    }
    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(400).json({ message: 'No user found' });
    }
    await user.deleteOne();

    const reply = `User ${user.username} with ID ${user._id} has been deleted`;
    res.json(reply);
});

const deleteUserById = asyncHandler(async (req, res) => {
    const userID = req.params.id;

    const user = await User.findById(userID).exec();

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    const task = await Task.findOne({ user: userID }).lean().exec();
    if (task) {
        return res.status(400).json({ message: 'User has assigned tasks' });
    }
    await user.deleteOne();

    const reply = `User ${user.username} with ID ${user._id} has been deleted`;
    res.json(reply);
});

module.exports = {
    getAllUsers,
    createNewUser,
    loginUser,
    updateUser,
    deleteUser,
    deleteUserById,
    getUser
}