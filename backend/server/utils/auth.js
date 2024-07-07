const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyJWT = (req, res, next) => {
  // Extract the authorization header
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // Check if the authorization header starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Extract the token from the header
  const token = authHeader.split(' ')[1];

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    req.userId = decoded.UserInfo.userId;
    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;

    next();
  });
};

module.exports = verifyJWT;
