const router = require('express').Router()

const {createUser} = require('../controllers/user.js')

router.route('/').post(createUser)

module.exports = router