const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user" ,
        required : true
    } ,
    food : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "food" ,
        required : true
    } ,
    likeCount : {
        type : Number ,
        default : 0
    } ,
}, {
    timestamps: true,
    collection: "likes",
}) ; // likes collection ka naam explicitly set kiya gaya hai

likeSchema.index({ user: 1, food: 1 }, { unique: true });

const likeModel = mongoose.model("like" , likeSchema) ; // like model ko create kiya gaya hai taki MongoDB me like collection ke liye schema define kiya ja sake

module.exports = likeModel ; // like model ko export kiya gaya hai taki dusre files me use kiya ja sake