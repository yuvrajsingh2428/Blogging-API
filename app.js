const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('./middlewares/errorHandler.js');
const blog = require('./routes/blog');
const CONFIG = require('./config/config.js');
const userRoutes = require('./routes/user.route.js')
const { loginUser } = require('./controllers/login.js');
const { createUser } = require('./controllers/user.js');
require('dotenv').config();


// for session
const session = require('express-session')
const MongoStore = require('connect-mongo');


const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Configure session management
app.use(session({
    secret: process.env.SESSION_SECRET,  // Ensure this is set in .env
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { secure: false }  // Set to true if using HTTPS
}));

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(CONFIG.DATABASE_CONNECT_STRING, {}); 
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Call the connectDB function
connectDB();

// Define routes
app.use('api/signup', createUser)
app.use('/api/login', loginUser)
app.use('/api/blog', blog);
app.use('/api/', userRoutes)

// Error handler middleware
app.use(errorHandler);

module.exports = app;
