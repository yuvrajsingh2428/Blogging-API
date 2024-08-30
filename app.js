const CONFIG = require('./config/config.js')
const express = require('express')
const cors = require('cors');  // Import CORS
const errorHandler = require('./middlewares/errorHandler.js')
const signup = require('./routes/signup.js')
const login = require('./controllers/login')
const blog = require('./routes/blog')

// Start your server or other initialization code here


const app = express()
app.use(cors());

console.log(CONFIG.DATABASE_CONNECT_STRING)


// connect to db
require('./middlewares/db.js')(CONFIG.DATABASE_CONNECT_STRING)

// parse information from request
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


//Define routes
app.use('/api/signup', signup)
app.use('/api/login', login)
app.use('/api/blog', blog)


// use error handler middleware
app.use(errorHandler)

module.exports = app


