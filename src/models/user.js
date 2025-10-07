const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName : {
        type: String,
        required : true,
    },
    lastName : {
        type:String
    },
    emailID : {
        type : String,
        required : true,
        lowercase:true,
        trim: true,
        unique : true
    },
    password : {
        type : String,
        required :true,
        unique : true,
    },
    age :  {
        type : Number,
        min : 18,
    },
    gender : {
        type : String,
        validate : {
            validator : function(value){
                return ["male","female","others"].includes(value.toLowerCase());
            },
            message : "Gender is not valid.."
        }
    },
    about : {
        type: String,
        maxLength : [50, 'Cannot exceed more than 50 characters']
    },
    skills : {
        type : [String],
        maxLength : [100 ,'You can add only upto 100 characters.']
    },
    photoURL : {
        type : String
    }

});

const User = mongoose.model("User",userSchema);

module.exports = User;