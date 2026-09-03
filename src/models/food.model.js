const mongoose = require("mongoose") ; // mongoose package ko import kiya gaya hai taki mongodb ke saath interact kiya ja sake

const foodSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : [true , "Name is required"] ,
    } ,
    vedios : {
        type : String ,
    } ,
    description : {
        type : String ,
        required : [true , "Description is required"] ,
    },
    foodPartner : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "foodPartner" , // food partner ke liye reference create kiya gaya hai taki food partner ke saath relation establish kiya ja sake   
    } ,
}) 

const foodModel = mongoose.model("food" , foodSchema) ; // food model ko create kiya gaya hai taki MongoDB me food collection ke liye schema define kiya ja sake

module.exports = foodModel ; // food model ko export kiya gaya hai taki dusre files me use kiya ja sake