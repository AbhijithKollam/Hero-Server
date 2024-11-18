const router=require('./Routes/router')

require("dotenv").config()
const express = require('express');

require('./DB/connection') 

const cors= require('cors')
const superman = express();
superman.use(cors());
superman.use(express.json());
superman.use(router)   ;

const PORT = process.env.PORT || 5000;
superman.listen(PORT,()=>{
    console.log(`Superman Server is connected at port ${PORT}`);
    
})
