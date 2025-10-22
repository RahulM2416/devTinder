const userAuth = require('../middlewares/userAuth');
const express = require('express');
const ConnectionRequest = require('../models/connectionRequest');
const requestRouter  = express.Router();

const User = require('../models/user');
const sendEmail = require('../utils/sendEmail');


requestRouter.post('/request/send/:status/:toUserID', userAuth , async (req,res)=> {
    try {
    const fromUserID = req.user;
    const {firstName} = req.user;
    const toUserID = req.params.toUserID;
    const status = req.params.status;

    const allowedStatus = ["interested","ignored"];
    if(!allowedStatus.includes(status)){
        throw new Error("not a valid status..!");
    }

    const toUser = await User.findById({_id:toUserID});
    if(!toUser){
        throw new Error("User not found");
    } 

    const exisitingConnection = await ConnectionRequest.findOne({
        $or : [
            {fromUserID , toUserID} , {fromUserID : toUserID , toUserID : fromUserID}
        ]
    });
    if(exisitingConnection){
        throw new Error('Connection is already available..!');  
    }

    const connectionRequest = new ConnectionRequest({
        fromUserID , toUserID , status
    });

    const data = await connectionRequest.save();
    const sendEmail =await sendEmail.run();

    res.json({
        message : firstName+ ", your request to " + toUser.firstName + " is successfull!",
        data,
    });

    } catch(err){
        res.send("ERROR : "+err.message);
    }
})

requestRouter.post('/request/review/:status/:requestID', userAuth , async (req,res)=>{
    try {
        const loggedUser = req.user;
    const {status, requestID} =req.params;

    const allowed_status = ["accepted", "ignored"];
    if(!allowed_status.includes(status)){
        throw new Error("Invalid Status");
    }

    const connectionRequest = await ConnectionRequest.findOne({
        _id : requestID,
        toUserID : loggedUser._id,
        status : "interested"
    }).populate("toUserID",["firstName","lastName"]);
    if(!connectionRequest){
        throw new Error("Invalid connection request");
    }
    connectionRequest.status = status;

    const data = await connectionRequest.save();

    res.json({message : "Connection "+ status + " successfull" , data})



} catch (err) {
    res.send("ERROR : "+err.message);
}
})

module.exports = requestRouter;

