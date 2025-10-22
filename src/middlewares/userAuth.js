const cookieParser = require('cookie-parser');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const userAuth = async (req,res,next)=> {
   try {
    const cookies = req.cookies;
    const {token} = cookies;
    if(!token){
        res.status(401).send("Token does not exist");
    }
    const verifyUser = await jwt.verify(token,process.env.JWT_TOKEN);
    
    if(!verifyUser){
        res.status(401).send("User does not exists");}

    const {_id} = verifyUser;
    const user = await User.findById(_id);
    req.user = user;
    next();
} catch(err){
    res.status(401).send("ERROR : "+err.message);
}
    
}

module.exports = userAuth;