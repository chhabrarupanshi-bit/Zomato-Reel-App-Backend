const mongoose = require('mongoose');

const saveSchema = new mongoose.Schema({
    user :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user" ,
        required : true
    } ,
    food : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "food" ,
        required : true
    } ,

} , {timestamps : true}) ; // timestamps ko true kiya jata hai taki createdAt aur updatedAt fields automatically add ho jaye

const saveModel = mongoose.model("save" , saveSchema) ; // save model ko create kiya gaya hai taki MongoDB me save collection ke liye schema define kiya ja sake

module.exports = saveModel ; // save model ko export kiya gaya hai taki dusre files me use kiya ja sake