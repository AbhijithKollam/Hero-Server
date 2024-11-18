const mongoose = require('mongoose');

// create schema for user
const complaintSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    cmpId: {
        type: String,
        required: true,
    },
    complaint: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    }
}, {
    timestamps: true  // This adds `createdAt` and `updatedAt` fields automatically
});

// Create the model
const complaints = mongoose.model("complaints", complaintSchema);

module.exports = complaints;
