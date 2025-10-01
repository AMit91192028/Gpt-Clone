const {Server} = require("socket.io")
const cookie = require("cookie")
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const aiService = require('../services/ai.service')
const {messageModel} = require('../models/message.model')
const {createMemory,queryMemory} = require('../services/vector.service')

function  initSocketServer(httpServer){
 const io = new Server (httpServer,{
    cors:{
        origin:'http://localhost:5173',
        allowedHeaders:["Content-Type","Authorization"],
         credentials:true,
         
    }
 })
   
 io.use(async(socket,next)=>{
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "")// This is used to check cookie so that user can connect when they logged in
    if(!cookies.token){
        next(new Error("Authentication error: No token provided"))
    }

    try{
    const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
    
    const user = await userModel.findById(decoded.id)
    socket.user =  user
    next();

    }
    catch(err){
      next(new Error("Authentication error: Invaild token"))
    }

 })

    io.on("connection",(socket)=>{
        socket.on("ai-message",async (messagePayload)=>{
             /*messagePayload ={chat:chatId, content:message text} */
         const[message,vector] = await Promise.all([
                messageModel.create({
                chat:messagePayload.chat,
                user:socket.user._id,
                content:messagePayload.content,
                role:"user"
            }),
            aiService.genrateVector(messagePayload.content),
            ])

             await createMemory({
                vector,
                messageId:message._id,
                metadata:{
                    chat:messagePayload.chat,
                    user:socket.user._id,
                    text:messagePayload.content
                }
            })
              
         //Now Here we are going to find that the on the bases of user currrent question is there meemory is extis by seesing its perivous vector
             /*const memory= await queryMemory({
               queryVector: vector,
                limit:3,
                metadata:{}
             })



            const chatHistory = (await messageModel.find({
                chat:messagePayload.chat
            }).sort({createdAt:-1}).limit(20).lean()).reverse()*/

         const[memory,chatHistory] = await Promise.all([

            queryMemory({
                queryVector:vector,
                limit:3,
                metadata:{
                    user: socket.user._id
                }
            }),

            messageModel.find({
                chat:messagePayload.chat
            }).sort({createdAt: -1}).limit(20).lean().then(messages => messages.reverse())
         ])
         
          const stm = chatHistory.map(item => {
                return {
                    role: item.role,
                    parts: [ { text: item.content } ]
                }
            })

                const ltm = [
                {
                    role: "model",
                    parts: [{
                    text: `Here are some relevant past messages for context:\n${memory.map(item => item.metadata.text).join("\n")}`
                    }]
                }
                ]


            const response = await aiService.generateResponse([...ltm,...stm])

         
        socket.emit('ai-response',{
                content:response,
                chat:messagePayload.chat
            })

               const[responseMessage,responseVector]= await Promise.all([
                 messageModel.create({
                chat:messagePayload.chat,
                user:socket.user._id,
                content:response,
                role:"model"
            }),
            aiService.genrateVector(response)
            ])

            await createMemory({
                vector: responseVector,
                messageId:responseMessage._id,
                metadata:{
                    chat:messagePayload.chat,
                    user :socket.user._id,
                    text:response
                }
            })
            
        })
    })
} 

module.exports = initSocketServer;