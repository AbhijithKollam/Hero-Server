const mongoose = require('mongoose');

// create schema for user
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true 
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String
    },
    unqId: {
        type: String,
        required: true,  
        unique: true      
    }
});

// Create the model
const users = mongoose.model("users", userSchema);

module.exports = users;
