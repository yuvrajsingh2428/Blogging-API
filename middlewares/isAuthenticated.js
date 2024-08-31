const User = require('../models/user.js');

const isAuthenticated = async (req, res, next) => {
    console.log('Session in isAuthenticated:', req.session); // Debug log
    if (req.session.userId) {
        try {
            const user = await User.findById(req.session.userId);
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }
            req.user = user; // Attach user to req
            console.log('User attached to req:', req.user); // Debug log
            next();
        } catch (err) {
            console.error('Error fetching user:', err); // Debug log
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
};

module.exports = isAuthenticated;
