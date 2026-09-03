const mongoose = require("mongoose") ; // db.js file me mongoose ko import kiya gaya hai

const connectDB = async function(){ // connectDb function ko async function ke roop me define kiya gaya hai
    try{
        await mongoose.connect(process.env.MONGO_URI) ; // MONGO_URI ko environment variable se access kiya gaya hai
        console.log("MongoDB connected successfully") ; // agar connection successful hota hai to message print kiya jata hai
    }
    catch(err) {
        console.error("Error connecting to MongoDB:", err) ; // agar connection me error aata hai to error message print kiya jata hai
    }
}

module.exports = connectDB ; // connectDb function ko export kiya gaya hai taki dusre files me use kiya ja sake 