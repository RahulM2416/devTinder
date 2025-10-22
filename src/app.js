const express = require('express');
const app = express();
const connectDB = require('./config/database');
const userAuth = require('./middlewares/userAuth');
const cookieParser = require('cookie-parser');
const User = require('./models/user');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/requests');
const userRouter = require('./routes/users');
const cors = require('cors');
require('dotenv').config();
require('date-fns')
require('node-cron');

app.use(cors({
    origin : 'http://localhost:5173',
    methods : ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
    allowedHeaders:['Content-Type', 'Authorization'],
    credentials : true,
}));
app.use(express.json());
app.use(cookieParser());


connectDB()
 .then(()=>{
    console.log("Database connected successfully.");
    app.listen(process.env.PORT,()=>{console.log("Server started on the port 3000")});
 })
 .catch((err)=>{console.error("Cannot connect to the database..!" + err.message);
});

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);


app.get("/user",async (req,res)=> {
    try {      
    const user = await User.find({emailID : req.body.emailID });
res.send(user);
 }
    
    catch(err){
        console.error(err.message);
    }
})

app.delete("/user", async (req,res)=>{
    try {
        
    const delUser = await User.findOneAndDelete({firstName : req.body.firstName}).collation({locale :'en',strength:1});
    res.send(delUser);
    }
    catch(err){
        console.error(err.message);
    }
})

app.patch("/user", async (req,res)=>{
    try {
        const updateUser = await User.findOneAndUpdate({emailID : req.body.emailID},{gender : "Male"},{runValidators: true}).collation({locale:'en', strength:1});
        res.send(updateUser);
    }
    catch(err){
        res.send(err.message);
    }
})



    

