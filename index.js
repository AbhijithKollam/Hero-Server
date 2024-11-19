const router=require('./Routes/router')

require("dotenv").config()
const express = require('express');

require('./DB/connection') 

const cors = require('cors');

const corsOptions = {
  origin: ['https://hero-admin-2.vercel.app', 'https://hero-user.vercel.app'],
  methods: 'GET,POST,PUT,DELETE',          
  allowedHeaders: 'Content-Type,Authorization', 
};

const superman = express();
superman.use(cors(corsOptions));
superman.use(express.json());
superman.use(router)   ;

const PORT = process.env.PORT || 5000;
superman.listen(PORT,()=>{
    console.log(`Superman Server is connected at port ${PORT}`);
    
})
