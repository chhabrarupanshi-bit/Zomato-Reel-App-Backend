const mongoose = require("mongoose" ); // mongoose package ko import kiya gaya hai taki mongodb ke saath interact kiya ja sake
const foodPartnerSchema = new mongoose.Schema({
    Businessname : {
        type : String ,
        required : [true , "Name is required"] ,
    } ,
    Ownername : {
        type : String ,
        required : [true , "Owner name is required"] ,
    } ,
    phone : {
        type : String ,
        required : [true , "Phone number is required"] ,
    } ,
    address : {
        type : String ,
        required : [true , "Address is required"] ,
    } ,
    email : {
        type : String ,
        unique : true ,
        required : [true , "Email is required"] ,
    } ,
    password : {
        type : String ,
        required : [true , "Password is required"] ,
    }
})

const foodPartnerModel = mongoose.model("foodPartner" , foodPartnerSchema) ; // foodPartner model ko create kiya gaya hai taki MongoDB me foodPartner collection ke liye schema define kiya ja sake

module.exports = foodPartnerModel ; // foodPartner model ko export kiya gaya hai taki dusre files me use kiya ja sake