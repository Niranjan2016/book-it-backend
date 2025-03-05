const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authorize = (allowedRoles) => {
    // Convert to array if single role or flatten if array of arrays
    const roles = Array.isArray(allowedRoles) ? allowedRoles.flat() : [allowedRoles];

    return async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }

            let decoded;
            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch (jwtError) {
                console.error('JWT Verification Error:', jwtError);
                return res.status(401).json({ message: 'Invalid token' });
            }

            const user = await User.findByPk(decoded.userId || decoded.user_id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Add user info to request
            req.user = user;

            // console.log('Debug Info:', {
            //     decodedToken: decoded,
            //     requiredRoles: roles,
            //     userRole: user.role
            // });

            if (!roles.includes(user.role)) {
                return res.status(403).json({
                    message: 'Access denied',
                    userRole: user.role,
                    requiredRoles: roles
                });
            }

            next();
        } catch (error) {
            console.error('Auth Error:', error);
            return res.status(401).json({
                message: 'Invalid token',
                error: error.message
            });
        }
    };
};

module.exports = { authorize };