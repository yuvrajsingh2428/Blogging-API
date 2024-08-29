const router = require('express').Router()

const {
    createBlog, 
    getBlogs, 
    getBlog
    } = require('../controllers/blog.js')

const {
    filterAndSort, 
    filterByPublished, 
    list, setUserFilter 
    } = require('../middlewares/APIfeature.middleware.js')

const getUserFromToken = require('../middlewares/verifyUser.js')

const pagination = require('../middlewares/pagination.js')

router.route('/')
.get(filterAndSort(), filterByPublished(), pagination(), list(), getBlogs)
.post(getUserFromToken(), createBlog)

router.route('/p')
.get(getUserFromToken(), filterAndSort(), setUserFilter(), pagination(), getBlogs)

router.route('/:id').get(getBlog)

module.exports = router