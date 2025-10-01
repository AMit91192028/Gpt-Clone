const express = require('express')
const router = express.Router();
const {registerUser,loginUser} = require('../controllers/auth.controllers')
const authMiddleware = require("../middlewares/auth.middleware")

router.post("/register",registerUser)
router.post ('/login',loginUser)

router.get('/check',authMiddleware.authUser,(req,res)=>{
    res.json({ loggedIn: true, user: req.user });
})


module.exports = router