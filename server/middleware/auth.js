const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = async (req, res, next) => {
    try {
        // Get token from header and remove 'Bearer ' prefix
        const token = req.header('Authorization')?.replace('Bearer ', '');

        // Check if token exists
        if (!token) {
            return res.status(401).json({ message: 'No authentication token, authorization denied.' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user info to request
        req.user = decoded;
        next();
        
    } catch (error) {
        res.status(401).json({ message: 'Token is invalid or expired.' });
    }
};

module.exports = auth;