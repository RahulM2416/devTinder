const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
    toUserID : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
    status : {
        type : String,
        enum : {
            values : ["interested","ignored","accepted","rejected"],
            message: '{VALUE} is incorrect status type.!'
    } }
},
{
    timestamps : true
}
)

const ConnectionRequest = new mongoose.model("ConnectionRequest",connectionRequestSchema);

connectionRequestSchema.pre('save', function(){
    if(this.fromUserID.equals(this.toUserID)){
        throw new Error("You cannot send request to yourself..!!");
    };
    next();
})
module.exports = ConnectionRequest;