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

    // Find user by username
    const user = await User.findOne({ username }).exec();

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Create JWT token
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

    res.json({ accessToken });
});

const getAllUsers = asyncHandler(async (req, res) => {
    // Fetch all users from the database
    const users = await User.find().lean().exec();

    if (!users.length) {
        return res.status(404).json({ message: 'No users found' });
    }

    res.json(users);
});


module.exports = {
    createNewUser,
    loginUser,
    getAllUsers
};
