require('dotenv').config()
const app = require('./src/app')
const connectDB = require('./src/db/db.js')
const initSocketServer = require('./src/sockets/socket.server.js')
const httpServer = require("http").createServer(app);

connectDB()
initSocketServer(httpServer)


httpServer.listen(3000,(err)=>{
    if(err){
        console.log("Server error")
    }
    console.log("Server is stared on port http://localhost:3000")
})
