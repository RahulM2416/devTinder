const express = require('express');
const userRouter = express.Router();
const userAuth = require('../middlewares/userAuth');
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');

userRouter.get('/user/requests/received', userAuth , async (req, res)=>{
    try {
        const loggedUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserID : loggedUser._id,
            status: "interested"
        }).populate("fromUserID" ,["firstName", "lastName" ,"photoURL","age","gender","about"] ).populate("toUserID" ,["firstName", "lastName"]); //"firstName lastName"); 

        res.json({
            message : "Data fetched successfully",
            data : connectionRequest
        });


    } catch(err) {
        res.status(404).send("ERROR : " + err.message);
    }
});

userRouter.get('/user/connections', userAuth , async(req,res)=>{
    try {
    const loggedUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
        $or : [
            {toUserID : loggedUser._id , status : "accepted"},
            {fromUserID : loggedUser._id, status : "accepted"}
        ]
    }).populate("fromUserID" , ["firstName" ,"lastName" , "about" ,"skills","gender","photoURL"]).populate("toUserID" ,["firstName" ,"lastName" , "about" ,"skills","gender","photoURL"]);


    const data = connectionRequest.map((conn)=> {
        return conn.fromUserID._id.toString() === loggedUser._id.toString() 
        ? conn.toUserID
        : conn.fromUserID;
         //return key.toUserID
    });
    res.json({data});
} 
catch(err) {
    res.send("ERROR : "+err.message);
}
});

userRouter.get('/user/feed', userAuth , async (req,res)=>{
    try  {
    const loggedUser = req.user;
    const fromUserID = req.user;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const connectionRequest = await ConnectionRequest.find({
        $or : [{fromUserID : loggedUser._id} , { toUserID : loggedUser._id}]
    }).select('fromUserID toUserID');

    const hideUsers = new Set();
    connectionRequest.forEach((key)=>{
        if(key.fromUserID) hideUsers.add(key.fromUserID.toString());
        if(key.toUserID) hideUsers.add(key.toUserID.toString());
    })


    const users = await User.find({
       // $and : [{_id : {$nin : Array.from(hideUsers) }}, {_id : {$ne : loggedUser._id}}]
       _id: { $nin: Array.from(hideUsers).concat([loggedUser._id.toString()]) }
    }).select("firstName lastName gender age about skills gender photoURL").skip((page-1)*limit).limit(limit);

    res.send(users);

} catch(err){
    res.send("ERROR : "+err.message);
}
});


module.exports = userRouter;