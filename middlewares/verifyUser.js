
const User = require('../models/user.js')

module.exports = async(req, res, next) => {
    try {
        // Check if user is authenticated using session
        if (!req.session.userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        // Fetch user from the database
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (err) {
        err.source = 'session middleware error';
        next(err);
    }
};

