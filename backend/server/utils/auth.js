const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' });
            req.user = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            next();
        }
    );
};

module.exports = verifyJWT;
