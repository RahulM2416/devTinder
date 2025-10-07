const validator = require('validator');

const validateSignup = (req) => {
    const {firstName , lastName , emailID , password} = req.body;

    if(!validator.isEmail(emailID)) {
        throw new Error("Email is not valid");
    }
    else if (!validator.isStrongPassword(password)){
        throw new Error("Give the strong password..");
    }
}

const validateToUpdate = (body)=>{
    const allowed_edits = ["firstName","lastName","about","gender","age","skills","photoURL"];

    const allAvailable = Object.keys(body).every((key)=> allowed_edits.includes(key));
    return allAvailable;
}

module.exports = {validateSignup, validateToUpdate
};