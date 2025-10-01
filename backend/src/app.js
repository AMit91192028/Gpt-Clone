const express = require('express')
const cookieParser = require('cookie-parser')
const authRouter = require('../src/router/auth.routes')
const chatRouter = require('../src/router/chat.routes')
const cors = require('cors');

const app = express();
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())



app.use('/api/auth',authRouter);
app.use('/chat',chatRouter);



module.exports= app