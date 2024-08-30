//starts an HTTP server using Express
const http = require('http') //This line imports the built-in http module from Node.js, which is used to create an HTTP server
const app = require('./app.js')


const {PORT} = require('./config/config')

const server = http.createServer(app)
server.listen(PORT, () => 
    console.log(`Running in ${process.env.NODE_ENV || 'development'} mode on port ${5000}`))