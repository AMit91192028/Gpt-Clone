require('dotenv').config()
const app = require('./src/app')
const connectDB = require('./src/db/db.js')
const initSocketServer = require('./src/sockets/socket.server.js')
const httpServer = require("http").createServer(app);


initSocketServer(httpServer)

connectDB().then(()=>{
httpServer.listen(3000,(err)=>{
    if(err){
        return console.log("Server error")
    }
    console.log("Server is stared on port http://localhost:3000")
})
})
.catch((err)=>{
    console.log(err)
})

