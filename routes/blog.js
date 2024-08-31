const router = require('express').Router()


const {
    createBlog, 
    getBlogs, 
    getBlog
    } = require('../controllers/blog.js')

const {
    filterAndSort, 
    filterByPublished, 
    list, 
    setUserFilter, 
    } = require('../middlewares/APIfeature.middleware.js')

    // Using this for session-based auth
const isAuthenticated = require('../middlewares/isAuthenticated.js')  // Middleware

const pagination = require('../middlewares/pagination.js')

router.route('/')
    .post(isAuthenticated, createBlog)  // Ensure isAuthenticated is used here
    .get(filterAndSort, filterByPublished, pagination, list, getBlogs)
 

router.route('/p')
    .get( isAuthenticated, filterAndSort, setUserFilter, pagination, getBlogs)

router.route('/:id').get(getBlog) // Ensure isAuthenticated is used here

module.exports = router