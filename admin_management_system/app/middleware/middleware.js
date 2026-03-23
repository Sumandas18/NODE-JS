const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
};

const employeeOnly = (req, res, next) => {
    if (req.user?.role !== 'employee') {
        return res.status(403).json({ message: 'Access denied: Employees only' });
    }
    next();
};

module.exports = { protect, adminOnly, employeeOnly };