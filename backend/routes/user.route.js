const express = require('express');
const router = express.Router();

const {createUser, logoutUser} = require('../controllers/user.js');
const isAuthenticated = require('../middlewares/isAuthenticated.js');
const {loginUser} = require('../controllers/login.js')

// Route to handle signup
router.post('/signup', createUser);

// logout route
router.post('/logout', logoutUser, isAuthenticated)

// login route
router.post('/login', loginUser)

module.exports = router;