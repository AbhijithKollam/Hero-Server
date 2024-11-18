const express= require('express');
const userController = require('../Controllers/userController');
const complaintController  = require('../Controllers/complaintController');
const router= express.Router();

// user registration
router.post('/user/register',userController.register)

// user login
router.post('/user/login',userController.login)

//add complaint
router.post('/user/sendComplaint',complaintController.sendComplaint)

//get user complaint
router.get('/user/getcmp/:id',complaintController.getUserCmp)

//get all complaint
router.get('/complaints/getAll',complaintController.getAllCmp)

//status change
router.post('/complaints/statusChange',complaintController.statusChange)

module.exports= router;