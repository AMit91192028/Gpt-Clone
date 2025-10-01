const {Server} = require("socket.io")
const cookie = require("cookie")
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const aiService = require('../services/ai.service')
const messageModel = require('../services/ai.service')
const {createMemory,queryMemory} = require('../services/vector.service')
const { chat } = require("@pinecone-database/pinecone/dist/assistant/data/chat")
function initSocketServer(httpServer){
 const io = new Server (httpServer,{})
   
 io.use(async(socket,next)=>{
    // authentication for socket connection
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "")// This is used to check cookie so that user can connect when they logged in
    if(!cookies.token){
        next(new Error("Authentication error: No token provided"))
    }

    try{
    const decoded = jwt.verify(cookies.token, process.env.JWT_SECERT);
    
    const user = await userModel.findById(decoded.id)
    socket.user =  user
    next();

    }
    catch(err){
      next(new Error("Authentication error: Invaild token"))
    }

 })

    io.on("connection",(socket)=>{
        console.log("New socket connection",socket.id)
        socket.on("ai-message",async (messagePayload)=>{
            console.log(messagePayload)
             /*messagePayload ={chat:chatId, content:message text} */

           const message =  await messageModel.create({
                chat:messagePayload.chat,
                user:socket.user._id,
                content:messagePayload.content,
                role:"user"
            })

            // vector genration is done Here------------->
            const vector = await aiService.genrateVector(messagePayload.content)
              console.log(vector);

        //Now Here we are going to find that the on the bases of user currrent question is there meemory is extis by seeing its perivous vector from vector database

             const memory= await queryMemory({
               queryVector: vector,
                limit:3,
                metadata:{}
             })
// save user message in pinecone---------->
            await createMemory({
                vector,
                messageId:message._id,
                metadata:{
                    chat:messagePayload.chat,
                    user:socket.user._id,
                    text:messagePayload.content
                }
            })

//chat History from the Mongoose Database
            const chatHistory = (await messageModel.find({
                chat:messagePayload.chat
            }).sort({createdAt:-1}).limit(20).lean()).reverse()

            // stm is genrated by mongoose database
            const stm = chatHistory.map(item=>{
                return{

                }
            })

// ltm is genrated by pinecode vector database
            const ltm = chatHistory.map()


//Genrate response from AI---------->
            const response = await aiService.generateResponse(chatHistory.map(item=>{
                 return{
                    role:item.role,
                    parts:[{text:item.content}]
                }
            }))

// Save AI response in DB          
            const responseMessage =  await messageModel.create({
                chat:messagePayload.chat,
                user:socket.user._id,
                content:response,
                role:"model"
            })

// Genrate vector for AI response         
            const responseVector = await aiService.genrateVector(response);

// Save AI message in Pinecone         
            await createMemory({
                vectors: responseVector,
                messageId:responseMessage._id,
                metadata:{
                    chat:messagePayload.chat,
                    user :socket.user._id,
                    text:response
                }
            })

//  send AI response to the user
            socket.emit('ai-response',{
                content:response,
                chat:messagePayload.chat
            })
            
        })
    })
} 

module.exports = initSocketServer;