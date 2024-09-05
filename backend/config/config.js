require("dotenv").config()

const DATABASE_CONNECT_STRING = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV || 'development';

const PORT = 5000 || process.env.PORT

const SECRET = process.env.SECRET;

module.exports = {
    DATABASE_CONNECT_STRING,
    PORT,
    SECRET
}