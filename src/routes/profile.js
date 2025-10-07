const express = require('express');
const profileRouter = express.Router();
const userAuth = require('../middlewares/userAuth');
const {validateToUpdate} = require('../utils/validateSignup');
const jwt = require('jsonwebtoken');
const cookieParser =  require('cookie-parser');
const bcrypt = require('bcrypt');
const app = express();
app.use(cookieParser());

profileRouter.get("/profile/view", userAuth, async (req,res)=>{
    try {

       /* const cookies = req.cookies;
        const {token} = cookies;
    const verifyUser = await jwt.verify(token,"@Rahulm6124");
    console.log(verifyUser);

    if(verifyUser){
        res.send("Profile fetched successfully..");
    } else {
        throw new Error("Token expired, login again")
    } */
   const user  = req.user;
   res.send(user);
    } catch(err) {
        res.status(401).send("ERROR : "+err.message);
    }
});


profileRouter.patch('/profile/edit',userAuth, async (req,res)=>{
    try {
        const user = req.body;
        if(!validateToUpdate(user)) {
        throw new Error("User Cannot edit these changes.");
    }
    
    const loggedUser = req.user;

    Object.keys(req.body).forEach((key)=>{
        loggedUser[key]=user[key];
    });
    await loggedUser.save();
    res.send(`${loggedUser.firstName} - your profile is updated successfully..`);

}
     catch(err){
        res.status(401).send("ERROR : "+err.message);
    }

})

profileRouter.patch("/profile/forgotPassword",userAuth, async(req,res)=>{
    const user = req.user;
    const changePass = req.body;
    Object.keys(changePass).forEach((key)=>(user[key]=changePass[key]));
    const updatedHash = await bcrypt.hash(user.password,10);
    user.password = updatedHash;
    user.save();
    res.send("Your passoword is changed successfully, now please login again..");
})

module.exports = profileRouter;

