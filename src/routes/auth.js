const express = require('express');
const authRouter = express.Router();
const User = require('../models/user');
const {validateSignup} = require('../utils/validateSignup');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


authRouter.post("/signup", async (req,res)=>{

 try {
        // check for validation
 validateSignup(req);

 const {firstName, lastName, emailID , password , photoURL} = req.body;
            
 const passwordHash = await bcrypt.hash(password,10);


 const user = new User({firstName,lastName,emailID,password:passwordHash, photoURL});
 const data = await user.save();
 const token = await jwt.sign({_id : data._id},"@Rahulm6124");
            res.cookie("token",token);
 res.json({message :"User data updated successfully.." , data : data});

 }
 catch(err) {
    res.send("Could not add the user " + err.message);
  }
 
});

authRouter.post("/login" , async (req,res)=>{
    try {
        const {emailID , password} = req.body;
         const userExists = await User.findOne({emailID : emailID});

         //findOne returns the entire document of the matched one.
         if(!userExists) {
            throw new Error("Email doesnt exsist..! , Please Sign Up");
         }
         const checkPassword = await bcrypt.compare(password,userExists.password);
         if(checkPassword){
            //create a jwt token
            const token = await jwt.sign({_id : userExists._id},"@Rahulm6124");
            // add token to the cookie to store in user browser
            res.cookie("token",token);

            res.send(userExists);
            //console.log(userExists);
           
         } else{ 
            throw new Error("Password is invalid")}}
    
    catch(err) {
        res.status(401).send(err.message);
    }
})

authRouter.post("/logout", (req,res)=>{
    res
    .cookie("token",null,{expires: new Date(Date.now())})
    .send("Logout Successfull..!");

})


 
module.exports = authRouter;