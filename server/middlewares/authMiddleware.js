const jwt = require('jsonwebtoken');

// Verify JWT token middleware
exports.verifyToken = (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({ message: 'No token provided. Access denied.' });
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length).trimLeft(); // Remove "Bearer " prefix
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Contains id, role, email etc.
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

// Role-based authorization middleware
exports.authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Access denied. Role '${req.user ? req.user.role : 'None'}' is not allowed.` 
            });
        }
        next();
    };
};
