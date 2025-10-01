const express = require('express')
const cookieParser = require('cookie-parser')
const authRouter = require('../src/router/auth.routes')
const chatRouter = require('../src/router/chat.routes')
const cors = require('cors');
const path = require('path')
const app = express();
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname,'../public')))


app.use('/api/auth',authRouter);
app.use('/chat',chatRouter);

app.get('*name',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/index.html'))
})


module.exports= app