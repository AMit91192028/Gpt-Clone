const express = require('express')
const router = express.Router()

const authMiddleware = require("../middlewares/auth.middleware")
const {createChat,getChats,getMessages} = require("../controllers/chat.controller")
router.post('/',authMiddleware.authUser,createChat)

router.get('/',authMiddleware.authUser,getChats);

router.get('/messages/:id',authMiddleware.authUser,getMessages)

module.exports= router