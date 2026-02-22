const mongoose = require('mongoose');

async function connectDB(){
    try{
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connect to MongoDB")
    }
    catch(err){
       return  console.error("Error connecting to MongoDb:",err)
    }
}

module.exports = connectDB