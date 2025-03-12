const jwt = require("jsonwebtoken");
require('dotenv').config();
const { JWT_SECRET } = process.env;

exports.AuthMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ message: 'No authorization header provided' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token', err: err });
        }
        req.user = decoded;
        next();
    });
};