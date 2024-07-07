const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// @desc Register new user
// @route POST /users/register
// @access Public
const createNewUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Confirm data
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for duplicate username or email
    const duplicate = await User.findOne({ $or: [{ username }, { email }] }).lean().exec();

    if (duplicate) {
        return res.status(409).json({ message: 'Username or email already exists' });
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

    // Create and store new user
    const userObject = { username, email, password: hashedPwd };
    const user = await User.create(userObject);

    if (user) { // created
        res.status(201).json({ message: `New user ${username} created` });
    } else {
        res.status(400).json({ message: 'Invalid user data received' });
    }
});

// @desc Login user
// @route POST /users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ username }).exec();

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const accessToken = jwt.sign(
        {
            UserInfo: {
                username: user.username,
                email: user.email,
                userId: user._id
            }
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Optionally, send `userId` in the response body if not using cookies
    res.json({
        message: 'Logged in successfully',
        accessToken,
        userId: user._id
    });
});

const getAllUsers = asyncHandler(async (req, res) => {
    // Fetch all users from the database
    const users = await User.find().lean().exec();

    if (!users.length) {
        return res.status(404).json({ message: 'No users found' });
    }

    res.json(users);
});

// @desc Get current user details
// @route GET /users/me
// @access Private
const getUser = asyncHandler(async (req, res) => {
    const username = req.user; // Or req.userId if you store userId

    const user = await User.findOne({ username }).lean().exec();

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json({
        username: user.username,
        email: user.email,
        userId: user._id
    });
});


// @desc Logout user
// @route POST /users/logout
// @access Public
const logoutUser = (req, res) => {
    console.log('Logout request received');
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
    createNewUser,
    loginUser,
    getAllUsers,
    getUser,
    logoutUser
};
