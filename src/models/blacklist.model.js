const mongoose = require("mongoose") ; // mongoose package ko import kiya gaya hai taki mongodb ke saath interact kiya ja sake

const blacklistSchema = new mongoose.Schema({
    token : {
        type : String ,
        required : true ,
    } 
    }, {timestamps : true}) ; // blacklist schema ko define kiya gaya hai taki token ko blacklist collection me store kiya ja sake

    blacklistSchema.index({token : 1} , {expireAfterSeconds : 3600}) ; // token ko 1 ghante ke baad expire karne ke liye index create kiya gaya hai

const blacklistModel = mongoose.model("blacklist" , blacklistSchema) ; // blacklist model ko create kiya gaya hai taki MongoDB me blacklist collection ke liye schema define kiya ja sake

module.exports = blacklistModel ; // blacklist model ko export kiya gaya hai taki dusre files me use kiya ja sake