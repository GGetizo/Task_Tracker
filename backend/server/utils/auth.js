const jwt =  require('jsonwebtoken');

// Middleware function to protect routes and check JWT tokens
const authMiddleware = (req, res, next) => {
    // Retrieve the token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Check if the token exists
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user information to the request object
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        // Handle invalid token
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;