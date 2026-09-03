const mongoose = require("mongoose") ;

const userSchema = new mongoose.Schema({
    fullName :{
        type : String ,
        required : ["true " , "Fullname is required"] ,
    },
    email :{
        type : String ,
        required : ["true" , "Email is required"] ,
        unique : true ,
    } ,
    password :{
        type : String ,
        required : ["true" , "Password is required"] ,
    }
}, {timestamps : true}) ;

const userModel = mongoose.model("user" , userSchema) ; // user model ko create kiya gaya hai taki MongoDB me user collection ke liye schema define kiya ja sake

module.exports = userModel ; // user model ko export kiya gaya hai taki dusre files me use kiya ja sake
