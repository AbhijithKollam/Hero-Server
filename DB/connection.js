// import mongoose
const mongoose = require('mongoose')

// get connection string from .env file
const connectionString = process.env.DATABASE;

// connect mongoDb
mongoose.connect(connectionString).then((res)=>{
    console.log("MongoDB connected successfully!!!");
}).catch((err)=>{
    console.log(`MongoDb connection failed due to ${err}`);
})