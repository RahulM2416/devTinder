const mongoose = require('mongoose');

const connectDB = async ()=> {
    await mongoose.connect("mongodb+srv://rahulm6124:hMmbxvPOfagpp30R@nodejs.x1hpcfk.mongodb.net/devTinder");
};

module.exports = connectDB;